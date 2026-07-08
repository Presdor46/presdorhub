import { db } from "./firebase.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const depositList = document.getElementById("depositList");

async function loadDeposits() {

  try {

    depositList.innerHTML = "Loading...";

    const snapshot = await getDocs(
      query(
        collection(db, "deposits"),
        where("status", "==", "pending")
      )
    );

    depositList.innerHTML = "";

    if (snapshot.empty) {

      depositList.innerHTML = "<h3>No Pending Deposits</h3>";

      return;

    }

    snapshot.forEach((docSnap) => {

      const data = docSnap.data();

      depositList.innerHTML += `

      <div class="card">

      <h3>${data.sender}</h3>

      <p>Amount: ₦${data.amount}</p>

      <p>Reference: ${data.reference || "-"}</p>

      <button
      class="approveBtn"
      data-id="${docSnap.id}"
      data-uid="${data.uid}"
      data-amount="${data.amount}">

      Approve Deposit

      </button>

      </div>

      `;

    });

  } catch (error) {

    depositList.innerHTML = error.message;

  }

}

loadDeposits();
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

document.addEventListener("click", async (e) => {

  if (!e.target.classList.contains("approveBtn")) return;

  const depositId = e.target.dataset.id;
  const uid = e.target.dataset.uid;
  const amount = Number(e.target.dataset.amount);

  try {

    const userRef = doc(db, "users", uid);

    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User not found.");
      return;
    }

    const user = userSnap.data();

    await updateDoc(userRef, {
      balance: (user.balance || 0) + amount
    });

    await updateDoc(doc(db, "deposits", depositId), {
      status: "approved"
    });

    await addDoc(collection(db, "transactions"), {
      uid: uid,
      type: "Deposit",
      amount: amount,
      status: "Completed",
      createdAt: serverTimestamp()
    });

    alert("Deposit Approved Successfully!");

    loadDeposits();

  } catch (error) {

    console.log(error);
    alert(error.message);

  }

});