import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    const userSnap = await getDoc(doc(db, "users", user.uid));

    if (!userSnap.exists()) {
      alert("User record not found.");
      window.location.href = "dashboard.html";
      return;
    }

    const userData = userSnap.data();

    console.log(userData);

    if (userData.isAdmin === true) {
      return;
    }

    alert("Access Denied");
    window.location.href = "dashboard.html";

  } catch (error) {

    console.log(error);
    alert(error.message);

  }

});