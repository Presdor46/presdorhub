import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const balance = document.getElementById("balance");
const logoutBtn = document.getElementById("logoutBtn");

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
      return;
    }

    const data = userSnap.data();

    fullName.textContent = data.fullName || "-";
    email.textContent = data.email || "-";
    phone.textContent = data.phone || "-";
    balance.textContent = "₦" + (data.balance || 0);

  } catch (error) {

    console.log(error);
    alert(error.message);

  }

});

logoutBtn.addEventListener("click", async () => {

  try {

    await signOut(auth);

    alert("Logged out successfully.");

    window.location.href = "login.html";

  } catch (error) {

    alert(error.message);

  }

});