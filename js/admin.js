import { auth, db } from "./firebase.js";

import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const usersCount = document.getElementById("usersCount");
const tasksCount = document.getElementById("tasksCount");
const depositCount = document.getElementById("depositCount");
const withdrawCount = document.getElementById("withdrawCount");

onAuthStateChanged(auth, async(user)=>{

  if(!user){
    location.href="login.html";
    return;
  }

  try{

    const adminSnap = await getDoc(doc(db,"users",user.uid));

    if(!adminSnap.exists()){
      location.href="dashboard.html";
      return;
    }

    if(adminSnap.data().isAdmin!==true){
      alert("Access Denied");
      location.href="dashboard.html";
      return;
    }

    usersCount.textContent =
      (await getDocs(collection(db,"users"))).size;

    tasksCount.textContent =
      (await getDocs(query(
        collection(db,"taskSubmissions"),
        where("status","==","pending")
      ))).size;

    depositCount.textContent =
      (await getDocs(query(
        collection(db,"depositRequests"),
        where("status","==","pending")
      ))).size;

    withdrawCount.textContent =
      (await getDocs(query(
        collection(db,"withdrawRequests"),
        where("status","==","pending")
      ))).size;

  }catch(error){

    console.log(error);
    alert(error.message);

  }

});