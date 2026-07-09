import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const depositList = document.getElementById("depositList");

async function loadDeposits() {

  depositList.innerHTML = "Loading...";

  try {

    const snapshot = await getDocs(collection(db, "depositRequests"));

    if (snapshot.empty) {
      depositList.innerHTML = "<h3>No deposit requests.</h3>";
      return;
    }

    depositList.innerHTML = "";

    for (const request of snapshot.docs) {

      const data = request.data();

      let fullName = "Unknown User";

      try {

        const userSnap = await getDoc(doc(db, "users", data.userId));

        if (userSnap.exists()) {
          fullName = userSnap.data().fullName || "Unknown User";
        }

      } catch (e) {}

      depositList.innerHTML += `

      <div class="card">

        <h3>${fullName}</h3>

        <p><b>Amount:</b> ₦${data.amount}</p>

        <p><b>Payer Name:</b> ${data.senderName}</p>

        <p><b>Reference:</b> ${data.reference || "N/A"}</p>

        <p><b>Status:</b> ${data.status}</p>

        <button class="approve"
        onclick="approveDeposit('${request.id}')">
        ✅ Approve
        </button>

        <button class="reject"
        onclick="rejectDeposit('${request.id}')">
        ❌ Reject
        </button>

      </div>

      `;

    }

  } catch (error) {

    console.error(error);

    depositList.innerHTML = "<h3>Failed to load deposits.</h3>";

  }

}

window.approveDeposit = async function(id){

  try{

    const requestRef = doc(db,"depositRequests",id);

    const requestSnap = await getDoc(requestRef);

    if(!requestSnap.exists()){
      alert("Request not found.");
      return;
    }

    const data = requestSnap.data();

    if(data.status==="approved"){
      alert("Already approved.");
      return;
    }

    const userRef = doc(db,"users",data.userId);

    const userSnap = await getDoc(userRef);

    if(!userSnap.exists()){
      alert("User not found.");
      return;
    }

    const user = userSnap.data();

    await updateDoc(userRef,{
      balance:(user.balance||0)+Number(data.amount)
    });

    await updateDoc(requestRef,{
      status:"approved"
    });

    await addDoc(collection(db,"transactions"),{

      userId:data.userId,

      title:"Deposit",

      amount:Number(data.amount),

      type:"credit",

      status:"completed",

      createdAt:serverTimestamp()

    });

    alert("Deposit Approved Successfully!");

    loadDeposits();

  }