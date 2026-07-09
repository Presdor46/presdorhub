import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ================= REGISTER =================
const referralInput = document.getElementById("referral");

const params = new URLSearchParams(window.location.search);

const refCode = params.get("ref");

if (referralInput && refCode) {
  referralInput.value = refCode;
}
const registerBtn = document.getElementById("registerBtn");

if (registerBtn) {

  registerBtn.addEventListener("click", async () => {

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const referral = document.getElementById("referral").value.trim();
    const password = document.getElementById("password").value;

    if (!fullName || !email || !phone || !password) {
      alert("Please fill all required fields.");
      return;
    }

    try {

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      const myReferralCode = user.uid.substring(0, 8).toUpperCase();

await setDoc(doc(db, "users", user.uid), {

  fullName: fullName,

  email: email,

  phone: phone,

  balance: 0,

  referrals: 0,

  tasks: 0,

  withdrawals: 0,

  referralCode: referral,

  myReferralCode: myReferralCode,

  isAdmin: false,

  joined: new Date().toISOString()

});
      // ===== Referral Bonus =====

if (referral) {

  const q = query(
    collection(db, "users"),
    where("myReferralCode", "==", referral.toUpperCase())
  );

  const result = await getDocs(q);

  if (!result.empty) {

    const referrerDoc = result.docs[0];

    const referrerRef = doc(db, "users", referrerDoc.id);

    const referrerData = referrerDoc.data();

    const bonus = 200; // Referral Bonus

    await updateDoc(referrerRef, {

      referrals: (referrerData.referrals || 0) + 1,

      balance: (referrerData.balance || 0) + bonus

    });

    await addDoc(collection(db, "transactions"), {

      userId: referrerDoc.id,

      title: "Referral Bonus",

      amount: bonus,

      type: "credit",

      status: "completed",

      createdAt: serverTimestamp()

    });

  }

}

      alert("Account Created Successfully!");

      window.location.href = "login.html";

    } catch (error) {

      alert(error.message);
      console.log(error);

    }

  });

}

// ================= LOGIN =================

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {

  loginBtn.addEventListener("click", async () => {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Login Successful!");

      window.location.href = "dashboard.html";

    } catch (error) {

      alert(error.message);
      console.log(error);

    }

  });

}