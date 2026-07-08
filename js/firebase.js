import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCtsCuAKEGrxFb1sDeG5mt2Fz_46Rzo_14",
  authDomain: "presdor-hub-v2.firebaseapp.com",
  projectId: "presdor-hub-v2",
  storageBucket: "presdor-hub-v2.firebasestorage.app",
  messagingSenderId: "599618631423",
  appId: "1:599618631423:web:da48a76c7d460c46a77eca"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };