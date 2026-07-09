import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const depositBtn = document.getElementById("depositBtn");

let currentUser = null;

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

});

depositBtn.addEventListener("click", async () => {

  const amount = Number(document.getElementById("amount").value);

  const senderName = document.getElementById("senderName").value.trim();

  const reference = document.getElementById("reference").value.trim();

  if (!amount || !senderName) {

    alert("Please fill all required fields.");

    return;

  }

  if (amount < 1000) {

    alert("Minimum deposit is ₦1000.");

    return;

  }

  try {

    await addDoc(collection(db, "depositRequests"), {

      userId: currentUser.uid,

      amount: amount,

      senderName: senderName,

      reference: reference,

      status: "pending",

      createdAt: serverTimestamp()

    });

    alert("Deposit request submitted successfully.");

    document.getElementById("amount").value = "";

    document.getElementById("senderName").value = "";

    document.getElementById("reference").value = "";

  } catch (error) {

    alert(error.message);

    console.log(error);

  }

});