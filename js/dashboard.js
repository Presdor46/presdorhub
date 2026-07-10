import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const welcome = document.getElementById("welcome");
const balance = document.getElementById("balance");
const referrals = document.getElementById("referrals");
const tasks = document.getElementById("tasks");
const withdrawals = document.getElementById("withdrawals");
const adminCard = document.getElementById("adminCard");

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

    welcome.textContent = `Welcome, ${data.fullName || "User"}`;

    balance.textContent = Number(data.balance || 0).toLocaleString();

    referrals.textContent = data.referrals || 0;

    const adminRef = doc(db, "admins", user.uid);
const adminSnap = await getDoc(adminRef);

if (adminSnap.exists()) {
    adminCard.style.display = "block";
} else {
    adminCard.style.display = "none";
}

    const taskSnapshot = await getDocs(
      query(
        collection(db, "taskSubmissions"),
        where("userId", "==", user.uid),
        where("status", "==", "approved")
      )
    );

    tasks.textContent = taskSnapshot.size;

    const withdrawSnapshot = await getDocs(
      query(
        collection(db, "withdrawRequests"),
        where("userId", "==", user.uid)
      )
    );

    withdrawals.textContent = withdrawSnapshot.size;

  } catch (error) {

    console.error(error);
    alert(error.message);

  }

});
const banners = document.querySelectorAll(".banner");

if (banners.length > 0) {

  let currentBanner = 0;

  setInterval(() => {

    banners[currentBanner].classList.remove("active");

    currentBanner++;

    if (currentBanner >= banners.length) {
      currentBanner = 0;
    }

    banners[currentBanner].classList.add("active");

  }, 4000);

}