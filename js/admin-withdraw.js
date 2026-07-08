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

const withdrawList = document.getElementById("withdrawList");

async function loadWithdrawals() {

  try {

    withdrawList.innerHTML = "Loading...";

    const snapshot = await getDocs(
      query(
        collection(db, "withdrawals"),
        where("status", "==", "pending")
      )
    );

    withdrawList.innerHTML = "";

    if (snapshot.empty) {

      withdrawList.innerHTML = "<h3>No Pending Withdrawals</h3>";

      return;

    }

    snapshot.forEach((withdrawDoc) => {

      const data = withdrawDoc.data();

      withdrawList.innerHTML += `

      <div class="card">

        <h3>${data.fullName || "User"}</h3>

        <p><strong>Amount:</strong> ₦${data.amount}</p>

        <p><strong>Account:</strong> ${data.accountNumber || "-"}</p>

        <p><strong>Bank:</strong> ${data.bankName || "-"}</p>

        <button class="approveBtn"
        data-id="${withdrawDoc.id}"
        data-uid="${data.uid}"
        data-amount="${data.amount}">

        Approve Withdrawal

        </button>

      </div>

      `;

    });

    const buttons = document.querySelectorAll(".approveBtn");

    buttons.forEach((button) => {

      button.addEventListener("click", async () => {

        const withdrawId = button.dataset.id;
        const uid = button.dataset.uid;
        const amount = Number(button.dataset.amount);

        try {

          const userRef = doc(db, "users", uid);

          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {

            alert("User not found");

            return;

          }

          const user = userSnap.data();

          if ((user.balance || 0) < amount) {

            alert("Insufficient Balance");

            return;

          }

          await updateDoc(userRef, {

            balance: (user.balance || 0) - amount

          });

          await updateDoc(doc(db, "withdrawals", withdrawId), {

            status: "approved"

          });

          await addDoc(collection(db, "transactions"), {

            uid: uid,
            type: "Withdrawal",
            amount: amount,
            status: "Completed",
            createdAt: serverTimestamp()

          });

          alert("Withdrawal Approved Successfully!");

          loadWithdrawals();

        } catch (error) {

          console.log(error);

          alert(error.message);

        }

      });

    });

  } catch (error) {

    withdrawList.innerHTML = error.message;

  }

}

loadWithdrawals();