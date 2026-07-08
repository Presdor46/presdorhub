import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const totalUsers = document.getElementById("totalUsers");
const pendingDeposits = document.getElementById("pendingDeposits");
const pendingWithdrawals = document.getElementById("pendingWithdrawals");
const totalTransactions = document.getElementById("totalTransactions");

async function loadDashboard() {

  try {

    // Total Users
    const usersSnap = await getDocs(collection(db, "users"));
    totalUsers.textContent = usersSnap.size;

    // Pending Deposits
    const depositsSnap = await getDocs(
      query(
        collection(db, "deposits"),
        where("status", "==", "pending")
      )
    );
    pendingDeposits.textContent = depositsSnap.size;

    // Pending Withdrawals
    const withdrawalsSnap = await getDocs(
      query(
        collection(db, "withdrawals"),
        where("status", "==", "pending")
      )
    );
    pendingWithdrawals.textContent = withdrawalsSnap.size;

    // Total Transactions
    const transactionsSnap = await getDocs(
      collection(db, "transactions")
    );
    totalTransactions.textContent = transactionsSnap.size;

  } catch (error) {

    console.log(error);
    alert(error.message);

  }

}

loadDashboard();