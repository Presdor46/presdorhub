import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const welcome = document.getElementById("welcome");
const balance = document.getElementById("balance");

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {

        const docRef = doc(db, "users", user.uid);

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            const data = docSnap.data();

            welcome.innerHTML = "Welcome " + data.fullName;
            balance.innerHTML = "₦" + (data.balance || 0);

        } else {

            alert("User account not found.");

        }

    } catch (error) {

        console.log(error);
        alert(error.message);

    }

});