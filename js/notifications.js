import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const notificationList = document.getElementById("notificationList");

async function loadNotifications() {

  notificationList.innerHTML = "Loading...";

  try {

    const q = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      notificationList.innerHTML =
      "<h3>No notifications available.</h3>";
      return;
    }

    notificationList.innerHTML = "";

    snapshot.forEach((doc) => {

      const data = doc.data();

      let date = "";

      if (data.createdAt) {
        date = data.createdAt.toDate().toLocaleString();
      }

      notificationList.innerHTML += `

      <div class="card">

        <h3>${data.title}</h3>

        <p>${data.message}</p>

        <p class="time">${date}</p>

      </div>

      `;

    });

  } catch (error) {

    console.error(error);

    notificationList.innerHTML =
    "<h3>Failed to load notifications.</h3>";

  }

}

loadNotifications();