import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const balance = document.getElementById("balance");
const withdrawBtn = document.getElementById("withdrawBtn");

let currentUser = null;
let currentBalance = 0;

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

  try {

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User not found.");
      return;
    }

    const data = userSnap.data();

    currentBalance = Number(data.balance || 0);

    balance.textContent = "₦" + currentBalance;

  } catch (error) {

    alert(error.message);

  }

});

withdrawBtn.addEventListener("click", async () => {

  const amount = Number(document.getElementById("amount").value);
  const accountName = document.getElementById("accountName").value.trim();
  const accountNumber = document.getElementById("accountNumber").value.trim();
  const bankName = document.getElementById("bankName").value.trim();

  if (!amount || !accountName || !accountNumber || !bankName) {
    alert("Please fill all fields.");
    return;
  }

  if (amount < 1000) {
    alert("Minimum withdrawal is ₦1000.");
    return;
  }

  if (amount > currentBalance) {
    alert("Insufficient balance.");
    return;
  }

  try {

    await addDoc(collection(db, "withdrawRequests"), {

      userId: currentUser.uid,
      amount: amount,
      accountName: accountName,
      accountNumber: accountNumber,
      bankName: bankName,
      status: "pending",
      createdAt: serverTimestamp()

    });

    alert("Withdrawal request submitted successfully.");

    document.getElementById("amount").value = "";
    document.getElementById("accountName").value = "";
    document.getElementById("accountNumber").value = "";
    document.getElementById("bankName").value = "";

    } catch (error) {

    alert(error.message);
    console.log(error);

  }

});

    alert