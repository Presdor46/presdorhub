import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const refLink = document.getElementById("refLink");
const totalReferrals = document.getElementById("totalReferrals");
const referralEarnings = document.getElementById("referralEarnings");

let myLink = "";

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

    const code = data.myReferralCode || user.uid.substring(0,8).toUpperCase();

    myLink = window.location.origin + "/register.html?ref=" + code;

    refLink.value = myLink;

    totalReferrals.textContent = data.referrals || 0;

    const earnings = (data.referrals || 0) * 200;

    referralEarnings.textContent = "₦" + earnings;

  } catch (error) {

    alert(error.message);

    console.log(error);

  }

});

window.copyLink = function () {

  navigator.clipboard.writeText(myLink);

  alert("Referral Link Copied Successfully!");

};