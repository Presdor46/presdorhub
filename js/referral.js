import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const referralCode = document.getElementById("referralCode");
const totalReferrals = document.getElementById("totalReferrals");
const totalBonus = document.getElementById("totalBonus");
const copyBtn = document.getElementById("copyBtn");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    const userRef = doc(db, "users", user.uid);

    const snap = await getDoc(userRef);

    if (!snap.exists()) return;

    let data = snap.data();

    let code = data.referralCode;

    if (!code) {

      code = "PRES" + user.uid.substring(0,6).toUpperCase();

      await updateDoc(userRef,{
        referralCode: code
      });

      data.referralCode = code;

    }

    referralCode.value = data.referralCode;

    totalReferrals.textContent = data.referrals || 0;

    totalBonus.textContent = "₦" + ((data.referrals || 0) * 500);

  } catch(error){

    console.log(error);

    alert(error.message);

  }

});

copyBtn.addEventListener("click", async ()=>{

  try{

    await navigator.clipboard.writeText(referralCode.value);

    alert("Referral Code Copied Successfully!");

  }catch{

    referralCode.select();

    document.execCommand("copy");

    alert("Referral Code Copied!");

  }

});