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

    // Check Admin access
    const AdminRef = doc(db, "Admins", user.uid);
    const AdminSnap = await getDoc(AdminRef);

    if (!AdminSnap.exists()) {
      alert("Access Denied");
      location.href = "dashboard.html";
      return;
    }

    // Total Users
    const users = await getDocs(collection(db, "users"));
    usersCount.textContent = users.size;

    // Pending Tasks
    const tasks = await getDocs(
      query(
        collection(db, "taskSubmissions"),
        where("status", "==", "pending")
      )
    );
    tasksCount.textContent = tasks.size;

    // Pending Deposits
    const deposits = await getDocs(
      query(
        collection(db, "depositRequests"),
        where("status", "==", "pending")
      )
    );
    depositCount.textContent = deposits.size;

    // Pending Withdrawals
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