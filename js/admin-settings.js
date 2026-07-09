import { db } from "./firebase.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const referralBonus = document.getElementById("referralBonus");
const minimumDeposit = document.getElementById("minimumDeposit");
const minimumWithdraw = document.getElementById("minimumWithdraw");
const notice = document.getElementById("notice");
const saveBtn = document.getElementById("saveBtn");

async function loadSettings(){

  try{

    const settingsRef = doc(db,"settings","app");

    const settingsSnap = await getDoc(settingsRef);

    if(settingsSnap.exists()){

      const data = settingsSnap.data();

      referralBonus.value = data.referralBonus || 200;
      minimumDeposit.value = data.minimumDeposit || 1000;
      minimumWithdraw.value = data.minimumWithdraw || 1000;
      notice.value = data.notice || "";

    }

  }catch(error){

    console.log(error);
    alert(error.message);

  }

}
import {
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

saveBtn.addEventListener("click", async () => {

  try {

    await setDoc(doc(db, "settings", "app"), {

      referralBonus: Number(referralBonus.value || 200),

      minimumDeposit: Number(minimumDeposit.value || 1000),

      minimumWithdraw: Number(minimumWithdraw.value || 1000),

      notice: notice.value.trim(),

      updatedAt: new Date().toISOString()

    });

    alert("Settings Saved Successfully!");

  } catch (error) {

    console.error(error);

    alert(error.message);

  }

});

loadSettings();