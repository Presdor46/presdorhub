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
      notificationList.innerHTML = `
        <h3>No notifications available.</h3>
      `;
      return;
    }

    notificationList.innerHTML = "";

    snapshot.forEach((item) => {

      const data = item.data();

      let date = "No Date";

      if (data.createdAt) {
        try {
          date = data.createdAt.toDate().toLocaleString();
        } catch (e) {
          date = "Unknown Date";
        }
      }

      notificationList.innerHTML += `
        <div class="card">

          <h3>${data.title || "Notification"}</h3>

          <p>${data.message || ""}</p>

          <p class="time">${date}</p>

        </div>
      `;

    });

  } catch (error) {

    console.error(error);

    alert(error.message);

    notificationList.innerHTML = `
      <h3>${error.message}</h3>
    `;

  }

}

loadNotifications();