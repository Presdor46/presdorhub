import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const notificationList = document.getElementById("notificationList");

async function loadNotifications() {

  try {

    notificationList.innerHTML = "Loading...";

    const q = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    notificationList.innerHTML = "";

    if (snapshot.empty) {

      notificationList.innerHTML = `
      <div class="card">
        <h3>No Notifications</h3>
        <p>No announcements available.</p>
      </div>
      `;

      return;

    }

    snapshot.forEach((docSnap) => {

      const data = docSnap.data();

      notificationList.innerHTML += `

      <div class="card">

        <h3>${data.title}</h3>

        <p>${data.message}</p>

      </div>

      `;

    });

  } catch (error) {

    console.log(error);

    notificationList.innerHTML = `
      <div class="card">
        <h3>Error</h3>
        <p>${error.message}</p>
      </div>
    `;

  }

}

loadNotifications();