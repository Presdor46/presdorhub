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

const withdrawList = document.getElementById("withdrawList");

async function loadWithdrawals() {

  withdrawList.innerHTML = "Loading...";

  try {

    const snapshot = await getDocs(collection(db, "withdrawRequests"));

    if (snapshot.empty) {
      withdrawList.innerHTML = "<h3>No withdrawal requests.</h3>";
      return;
    }

    withdrawList.innerHTML = "";

    for (const request of snapshot.docs) {

      const data = request.data();

      let fullName = "Unknown User";

      try {

        const userSnap = await getDoc(doc(db, "users", data.userId));

        if (userSnap.exists()) {
          fullName = userSnap.data().fullName || "Unknown User";
        }

      } catch (e) {
        console.log(e);
      }

      withdrawList.innerHTML += `

      <div class="card">

        <h3>${fullName}</h3>

        <p><b>Amount:</b> ₦${data.amount}</p>

        <p><b>Bank:</b> ${data.bankName}</p>

        <p><b>Account Name:</b> ${data.accountName}</p>

        <p><b>Account Number:</b> ${data.accountNumber}</p>

        <p><b>Status:</b> ${data.status}</p>

        <button class="approve" onclick="approveWithdraw('${request.id}')">
        ✅ Approve
        </button>

        <button class="reject" onclick="rejectWithdraw('${request.id}')">
        ❌ Reject
        </button>

      </div>

      `;

    }

  } catch (error) {

    console.error(error);

    withdrawList.innerHTML = "<h3>Failed to load withdrawals.</h3>";

  }

}

window.approveWithdraw = async function(id) {

  try {

    const requestRef = doc(db, "withdrawRequests", id);

    const requestSnap = await getDoc(requestRef);

    if (!requestSnap.exists()) {
      alert("Request not found.");
      return;
    }

    const data = requestSnap.data();

    if (data.status === "approved") {
      alert("Already approved.");
      return;
    }

    const userRef = doc(db, "users", data.userId);

    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User not found.");
      return;
    }

    const user = userSnap.data();

    const currentBalance = Number(user.balance || 0);

    const amount = Number(data.amount || 0);

    if (currentBalance < amount) {
      alert("User balance is not enough.");
      return;
    }

    await updateDoc(userRef, {
      balance: currentBalance - amount
    });

    await updateDoc(requestRef, {
      status: "approved"
    });

    await