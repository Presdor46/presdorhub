import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const usersCount = document.getElementById("usersCount");
const tasksCount = document.getElementById("tasksCount");
const depositCount = document.getElementById("depositCount");
const withdrawCount = document.getElementById("withdrawCount");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    location.href = "login.html";
    return;
  }

  try {

    const adminRef = doc(db, "users", user.uid);
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists()) {
      location.href = "dashboard.html";
      return;
    }

    if (adminSnap.data().isAdmin !== true) {
      alert("Access Denied");
      location.href = "dashboard.html";
      return;
    }

    const users = await getDocs(collection(db, "users"));
    usersCount.textContent = users.size;

    const tasks = await getDocs(
      query(
        collection(db, "taskSubmissions"),
        where("status", "==", "pending")
      )
    );
    tasksCount.textContent = tasks.size;

    const deposits = await getDocs(
      query(
        collection(db, "depositRequests"),
        where("status", "==", "pending")
      )
    );
    depositCount.textContent = deposits.size;

    const withdraws = await getDocs(
      query(
        collection(db, "withdrawRequests"),
        where("status", "==", "pending")
      )
    );
    withdrawCount.textContent = withdraws.size;

  } catch (error) {

    console.error(error);
    alert(error.message);

  }

});