import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const checkinBtn = document.getElementById("checkinBtn");

const BONUS = 100;

onAuthStateChanged(auth, (user) => {

  if (!user) {

    window.location.href = "login.html";

    return;

  }

  checkinBtn.addEventListener("click", async () => {

    try {

      const userRef = doc(db, "users", user.uid);

      const snap = await getDoc(userRef);

      if (!snap.exists()) {

        alert("User not found");

        return;

      }

      const data = snap.data();

      const today = new Date().toISOString().split("T")[0];

      if (data.lastCheckin === today) {

        alert("You have already claimed today's reward.");

        return;

      }

      await updateDoc(userRef, {

        balance: (data.balance || 0) + BONUS,

        lastCheckin: today

      });

      await addDoc(collection(db, "transactions"), {

        uid: user.uid,

        type: "Daily Check-in",

        amount: BONUS,

        status: "Completed",

        createdAt: serverTimestamp()

      });

      alert("🎉 Daily reward claimed successfully!");

      location.reload();

    } catch (error) {

      console.log(error);

      alert(error.message);

    }

  });

});