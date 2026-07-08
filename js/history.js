import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const historyList = document.getElementById("historyList");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  historyList.innerHTML = "Loading...";

  try {

    const q = query(
      collection(db, "transactions"),
      where("uid", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    historyList.innerHTML = "";

    if (snapshot.empty) {
      historyList.innerHTML = `
        <div class="card">
          <h3>No Transactions Yet</h3>
        </div>
      `;
      return;
    }

    snapshot.forEach((transaction) => {

      const data = transaction.data();

      let date = "-";

      if (data.createdAt) {
        date = new Date(data.createdAt.seconds * 1000).toLocaleString();
      }

      historyList.innerHTML += `
        <div class="card">

          <h3>${data.type}</h3>

          <p><strong>Amount:</strong> ₦${data.amount}</p>

          <p><strong>Status:</strong> ${data.status}</p>

          <p><strong>Date:</strong> ${date}</p>

        </div>
      `;

    });

  } catch (error) {

    historyList.innerHTML = `
      <div class="card">
        <h3>Error</h3>
        <p>${error.message}</p>
      </div>
    `;

    console.log(error);

  }

});