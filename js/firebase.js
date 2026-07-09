import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDR0yxjLv-SM_LXTZHRjA8SLrG3fOShGRk",
  authDomain: "presdor-hub.firebaseapp.com",
  projectId: "presdor-hub",
  storageBucket: "presdor-hub.firebasestorage.app",
  messagingSenderId: "386435505116",
  appId: "1:386435505116:web:e79a285877ebe8bc9a0d19"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);