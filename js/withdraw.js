import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const amountInput = document.getElementById("amount");
const withdrawBtn = document.getElementById("withdrawBtn");

let currentUser = null;

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

});

withdrawBtn.addEventListener("click", async () => {

  try {

    if (!currentUser) {
      alert("Please login first.");
      return;
    }

    if (!amountInput.value) {
      alert("Please enter amount.");
      return;
    }

    const withdrawAmount = Number(amountInput.value);

    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User not found.");
      return;
    }

    const userData = userSnap.data();

    if (withdrawAmount <= 0) {
      alert("Invalid amount.");
      return;
    }

    if (withdrawAmount > (userData.balance || 0)) {
      alert("Insufficient balance.");
      return;
    }

    await addDoc(collection(db, "withdrawals"), {
      uid: currentUser.uid,
      amount: withdrawAmount,
      status: "pending",
      createdAt: serverTimestamp()
    });

    await addDoc(collection(db, "transactions"), {
      uid: currentUser.uid,
      type: "Withdrawal",
      amount: withdrawAmount,
      status: "Pending",
      createdAt: serverTimestamp()
    });

    alert("Withdrawal request submitted successfully.");

    amountInput.value = "";

  } catch (error) {

    alert(error.message);
    console.log(error);

  }

});