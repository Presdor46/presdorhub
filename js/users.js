import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const userList = document.getElementById("userList");

async function loadUsers() {

  try {

    userList.innerHTML = "Loading...";

    const snapshot = await getDocs(collection(db, "users"));

    userList.innerHTML = "";

    if (snapshot.empty) {

      userList.innerHTML = "<h3>No Users Found</h3>";

      return;

    }

    snapshot.forEach((userDoc) => {

      const data = userDoc.data();

      userList.innerHTML += `

      <div class="card">

        <h3>${data.fullName || "No Name"}</h3>

        <p><strong>Email:</strong> ${data.email || "-"}</p>

        <p><strong>Phone:</strong> ${data.phone || "-"}</p>

        <p><strong>Balance:</strong> ₦${data.balance || 0}</p>

        <p><strong>Tasks:</strong> ${data.tasks || 0}</p>

        <p><strong>Referrals:</strong> ${data.referrals || 0}</p>

      </div>

      `;

    });

  } catch (error) {

    console.log(error);

    userList.innerHTML = "<h3>" + error.message + "</h3>";

  }

}

loadUsers();