import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const welcome = document.getElementById("welcome");
const balance = document.getElementById("balance");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    const userRef = doc(db, "users", user.uid);

    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {

      alert("User data not found.");
      return;

    }

    const data = userSnap.data();

    welcome.textContent = "Welcome, " + (data.fullName || "User");

    balance.textContent = data.balance || 0;

  } catch (error) {

    console.log(error);

    alert(error.message);

  }

});