import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const amount = document.getElementById("amount");
const sender = document.getElementById("sender");
const reference = document.getElementById("reference");
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

  if (!currentUser) {
    alert("Please login first.");
    return;
  }

  if (amount.value === "" || sender.value.trim() === "") {
    alert("Please fill all required fields.");
    return;
  }

  try {

    await addDoc(collection(db, "deposits"), {
      uid: currentUser.uid,
      sender: sender.value.trim(),
      amount: Number(amount.value),
      reference: reference.value.trim(),
      status: "pending",
      createdAt: serverTimestamp()
    });

    alert("Deposit request submitted successfully.");

    amount.value = "";
    sender.value = "";
    reference.value = "";

  } catch (error) {

    console.log(error);
    alert(error.message);

  }

});