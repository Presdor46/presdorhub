import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ================= REGISTER =================

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

      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: email,
        phone: phone,
        referral: referral,
        balance: 0,
        referrals: 0,
        tasks: 0,
        isAdmin: false,
        joined: new Date().toISOString()
      });

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