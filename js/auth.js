import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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

alert("Please fill all fields.");

return;

}

try {

const userCredential = await createUserWithEmailAndPassword(

auth,

email,

password

);

const user = userCredential.user;

const referralCode =
"PRES" + user.uid.substring(0,6).toUpperCase();

await setDoc(doc(db,"users",user.uid),{

fullName,

email,

phone,

balance:0,

referrals:0,

tasks:0,

isAdmin:false,

referralCode,

joined:new Date().toISOString()

});
        // ================= REFERRAL BONUS =================

      if (referral !== "") {

        const q = query(
          collection(db, "users"),
          where("referralCode", "==", referral.toUpperCase())
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {

          const referrerDoc = snapshot.docs[0];

          const referrer = referrerDoc.data();

          await updateDoc(referrerDoc.ref, {

            balance: (referrer.balance || 0) + 500,

            referrals: (referrer.referrals || 0) + 1

          });

          await addDoc(collection(db, "transactions"), {

            uid: referrerDoc.id,

            type: "Referral Bonus",

            amount: 500,

            status: "Completed",

            createdAt: serverTimestamp()

          });

        }

      }

      alert("Account Created Successfully!");

      window.location.href = "login.html";

    } catch (error) {

      console.log(error);

      alert(error.message);

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

      await signInWithEmailAndPassword(auth, email, password);

      alert("Login Successful!");

      window.location.href = "dashboard.html";

    } catch (error) {

      console.log(error);

      alert(error.message);

    }

  });

}