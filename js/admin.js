import { db } from "./firebase.js";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const depositList = document.getElementById("depositList");

async function loadDeposits() {

  if (!depositList) return;

  depositList.innerHTML = "Loading...";

  try {

    const q = query(
      collection(db, "deposits"),
      where("status", "==", "pending")
    );

    const snapshot = await getDocs(q);

    depositList.innerHTML = "";

    if (snapshot.empty) {
      depositList.innerHTML = "<h3>No Pending Deposits</h3>";
      return;
    }

    snapshot.forEach((depositDoc) => {

      const data = depositDoc.data();

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <p><strong>Name:</strong> ${data.sender}</p>
        <p><strong>Amount:</strong> ₦${data.amount}</p>
        <p><strong>Reference:</strong> ${data.reference || "-"}</p>

        <button data-id="${depositDoc.id}"
                data-uid="${data.uid}"
                data-amount="${data.amount}">
          Approve Deposit
        </button>
      `;

      const btn = card.querySelector("button");

      btn.addEventListener("click", async () => {

        try {

          const userRef = doc(db, "users", data.uid);

          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            alert("User not found");
            return;
          }

          const user = userSnap.data();

          await updateDoc(userRef, {
            balance: (user.balance || 0) + Number(data.amount)
          });

          await updateDoc(doc(db, "deposits", depositDoc.id), {
            status: "approved"
          });

          await addDoc(collection(db, "transactions"), {
            uid: data.uid,
            type: "Deposit",
            amount: Number(data.amount),
            status: "Completed",
            createdAt: serverTimestamp()
          });

          alert("Deposit Approved Successfully");

          loadDeposits();

        } catch (error) {

          alert(error.message);

        }

      });

      depositList.appendChild(card);

    });

  } catch (error) {

    depositList.innerHTML = "<h3>" + error.message + "</h3>";

    console.log(error);

  }

}

loadDeposits();