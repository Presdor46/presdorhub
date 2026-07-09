import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const loader = document.getElementById("loader");
const welcome = document.getElementById("welcome");
const balance = document.getElementById("balance");
const referrals = document.getElementById("referrals");
const tasks = document.getElementById("tasks");
const withdrawals = document.getElementById("withdrawals");
const adminCard = document.getElementById("adminCard");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    const userRef = doc(db, "users", user.uid);

    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {

      alert("User not found.");

      loader.style.display = "none";

      return;

    }

    const data = userSnap.data();

    welcome.textContent = "Welcome, " + (data.fullName || "User");

    balance.textContent = "₦" + (data.balance || 0);

    referrals.textContent = data.referrals || 0;

    tasks.textContent = data.tasks || 0;

    withdrawals.textContent = data.withdrawals || 0;
    
if (data.isAdmin === true) {
    adminCard.style.display = "block";
}
  } catch (error) {

    console.error(error);

    alert(error.message);

  }

  loader.style.display = "none";

});