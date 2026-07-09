import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {

    const userCredential =
      await createUserWithEmailAndPassword(auth, email, password);

    const referralCode =
      Math.random().toString(36).substring(2,8).toUpperCase();

    await setDoc(doc(db,"users",userCredential.user.uid),{

      fullName,
      email,
      balance:0,
      phone:"",
      referralCode,
      referredBy:"",
      totalReferrals:0,
      referralBonus:0,
      taskCompleted:0,
      createdAt:new Date()

    });

    alert("Account created successfully!");

    window.location.href="login.html";

  } catch(error){

    alert(error.message);

  }

});