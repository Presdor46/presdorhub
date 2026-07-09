import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const usersCount = document.getElementById("usersCount");
const tasksCount = document.getElementById("tasksCount");
const withdrawCount = document.getElementById("withdrawCount");
const transactionCount = document.getElementById("transactionCount");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    // Tabbatar admin ne
    const userSnap = await getDoc(doc(db, "users", user.uid));

    if (!userSnap.exists()) {
      alert("User not found.");
      window.location.href = "dashboard.html";
      return;
    }

    const userData = userSnap.data();

    if (userData.isAdmin !== true) {
      alert("Access denied. Admin only.");
      window.location.href = "dashboard.html";
      return;
    }

    // Total Users
    const usersSnapshot = await getDocs(collection(db, "users"));
    usersCount.textContent = usersSnapshot.size;

    // Pending Tasks
    const pendingTasks = await getDocs(
      query(
        collection(db, "taskSubmissions"),
        where("status", "==", "pending")
      )
    );
    tasksCount.textContent = pendingTasks.size;

    // Pending Withdrawals
    const pendingWithdraws = await getDocs(
      query(
        collection(db, "withdrawRequests"),
        where("status", "==", "pending")
      )
    );
    withdrawCount.textContent = pendingWithdraws.size;

    // Total Transactions
    const transactions = await getDocs(collection(db, "transactions"));
    transactionCount.textContent = transactions.size;

  } catch (error) {

    console.error(error);
    alert(error.message);

  }

});