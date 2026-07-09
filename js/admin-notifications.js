import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const title = document.getElementById("title");
const message = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", async () => {

  if (!title.value.trim() || !message.value.trim()) {
    alert("Please fill all fields.");
    return;
  }

  try {

    await addDoc(collection(db, "notifications"), {

      title: title.value.trim(),

      message: message.value.trim(),

      createdAt: serverTimestamp()

    });

    alert("Notification sent successfully.");

    title.value = "";
    message.value = "";

  } catch (error) {

    console.error(error);

    alert(error.message);

  }

});