import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
      window.location.href = "dashboard.html";
      return;
    }

    const data = userSnap.data();

    if (data.isAdmin !== true) {
      alert("Access denied. Admin only.");
      window.location.href = "dashboard.html";
      return;
    }

    console.log("Admin access granted.");

  } catch (error) {

    console.error(error);
    alert(error.message);

  }

});