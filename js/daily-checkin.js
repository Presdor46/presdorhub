import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const claimBtn = document.getElementById("claimBtn");

let currentUser = null;

const REWARD = 20;

onAuthStateChanged(auth, (user) => {

  if (!user) {
    location.href = "login.html";
    return;
  }

  currentUser = user;

});

claimBtn.addEventListener("click", async () => {

  if (!currentUser) return;

  try {

    const userRef = doc(db, "users", currentUser.uid);

    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User not found.");
      return;
    }

    const data = userSnap.data();

    const lastClaim = data.lastCheckin?.toMillis
      ? data.lastCheckin.toMillis()
      : 0;

    const now = Date.now();

    const hours24 = 24 * 60 * 60 * 1000;

    if (now - lastClaim < hours24) {

      const remain = hours24 - (now - lastClaim);

      const hrs = Math.floor(remain / (1000 * 60 * 60));

      const mins = Math.floor((remain % (1000 * 60 * 60)) / (1000 * 60));

      alert(`You have already claimed today's reward.\n\nCome back in ${hrs}h ${mins}m`);

      return;

    }

    await updateDoc(userRef, {

      balance: Number(data.balance || 0) + REWARD,

      lastCheckin: serverTimestamp()

    });

    await addDoc(collection(db, "transactions"), {

      userId: currentUser.uid,

      title: "Daily Check-in Reward",

      amount: REWARD,

      type: "credit",

      status: "completed",

      createdAt: serverTimestamp()

    });

    alert("🎉 Daily reward claimed successfully!");

  } catch (error) {

    console.error(error);

    alert(error.message);

  }

});