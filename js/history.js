import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const history = document.getElementById("history");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  loadHistory(user.uid);

});

async function loadHistory(uid) {

  history.innerHTML = "Loading...";

  try {

    const q = query(
      collection(db, "transactions"),
      where("userId", "==", uid)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      history.innerHTML = "<h3>No Transactions Found.</h3>";
      return;
    }

    history.innerHTML = "";

    snapshot.forEach((doc) => {

      const data = doc.data();

      history.innerHTML += `

      <div class="card">

        <h3>${data.title || "Transaction"}</h3>

        <p class="amount">
        ₦${data.amount || 0}
        </p>

        <p class="status">
        ${data.status || "Completed"}
        </p>

        <p>
        ${data.date || ""}
        </p>

      </div>

      `;

    });

  } catch (error) {

    console.log(error);

    history.innerHTML =
    "<h3>Failed to load history.</h3>";

  }

}