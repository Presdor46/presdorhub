import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc,
  getDocs,
  updateDoc,
  addDoc,
  collection,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ===========================
   REGISTER
=========================== */

const referralInput = document.getElementById("referralCode");

const params = new URLSearchParams(window.location.search);
const ref = params.get("ref");

if (referralInput && ref) {
  referralInput.value = ref;
}

const registerBtn = document.getElementById("registerBtn");

if (registerBtn) {

  registerBtn.addEventListener("click", async () => {

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const referral = document.getElementById("referralCode").value.trim();

    if (!fullName || !email || !password) {
      alert("Please fill all required fields.");
      return;
    }

    try {

      const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      const myReferralCode =
      user.uid.substring(0,8).toUpperCase();

      await setDoc(doc(db,"users",user.uid),{

        fullName,
        email,

        balance:0,
        referrals:0,
        tasks:0,
        withdrawals:0,

        referralCode:referral,
        myReferralCode,

        isAdmin:false,

        createdAt:serverTimestamp()

      });

      // Referral Bonus

      if(referral){

        const q = query(
          collection(db,"users"),
          where(
            "myReferralCode",
            "==",
            referral.toUpperCase()
          )
        );

        const result = await getDocs(q);

        if(!result.empty){

          const referrerDoc = result.docs[0];

          const referrerData = referrerDoc.data();

          const bonus = 200;

          await updateDoc(
            doc(db,"users",referrerDoc.id),
            {

              referrals:
              (referrerData.referrals||0)+1,

              balance:
              (referrerData.balance||0)+bonus

            }
          );

          await addDoc(
            collection(db,"transactions"),
            {

              userId:referrerDoc.id,

              title:"Referral Bonus",

              amount:bonus,

              type:"credit",

              status:"completed",

              createdAt:serverTimestamp()

            }
          );

        }

      }

      alert("Account Created Successfully!");

      location.href="login.html";

    } catch(error){

      console.error(error);

      alert(error.message);

    }

  });

}

/* ===========================
   LOGIN
=========================== */

const loginBtn = document.getElementById("loginBtn");

if(loginBtn){

  loginBtn.addEventListener("click",async()=>{

    const email =
    document.getElementById("email").value.trim();

    const password =
    document.getElementById("password").value;

    if(!email || !password){

      alert("Please enter email and password.");

      return;

    }

    try{

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Login Successful!");

      location.href="dashboard.html";

    }catch(error){

      console.error(error);

      alert(error.message);

    }

  });

}