import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const taskList = document.getElementById("taskList");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

  loadTasks();

});

async function loadTasks() {

  taskList.innerHTML = "Loading...";

  try {

    const taskSnapshot = await getDocs(collection(db, "tasks"));

    taskList.innerHTML = "";

    if (taskSnapshot.empty) {

      taskList.innerHTML = "<h3>No Tasks Available</h3>";

      return;

    }

    for (const taskDoc of taskSnapshot.docs) {

      const task = taskDoc.data();

      const completedRef = doc(
        db,
        "completedTasks",
        currentUser.uid + "_" + taskDoc.id
      );

      const completedSnap = await getDoc(completedRef);

      const completed = completedSnap.exists();

      taskList.innerHTML += `

      <div class="card">

        <h3>${task.title}</h3>

        <p><strong>Reward:</strong> ₦${task.reward}</p>

        <button
          class="completeBtn"
          data-id="${taskDoc.id}"
          data-reward="${task.reward}"
          ${completed ? "disabled" : ""}>

          ${completed ? "Completed ✅" : "Complete Task"}

        </button>

      </div>

      `;

    }
        const buttons = document.querySelectorAll(".completeBtn");

    buttons.forEach((button) => {

      button.addEventListener("click", async () => {

        const taskId = button.dataset.id;
        const reward = Number(button.dataset.reward);

        const completedRef = doc(
          db,
          "completedTasks",
          currentUser.uid + "_" + taskId
        );

        const completedSnap = await getDoc(completedRef);

        if (completedSnap.exists()) {

          alert("You have already completed this task.");

          return;

        }

        const userRef = doc(db, "users", currentUser.uid);

        const userSnap = await getDoc(userRef);

        const user = userSnap.data();

        await updateDoc(userRef, {

          balance: (user.balance || 0) + reward,

          tasks: (user.tasks || 0) + 1

        });

        await addDoc(collection(db, "transactions"), {

          uid: currentUser.uid,

          type: "Task Reward",

          amount: reward,

          status: "Completed",

          createdAt: serverTimestamp()

        });

        await setDoc(completedRef, {

          uid: currentUser.uid,

          taskId: taskId,

          completedAt: serverTimestamp()

        });

        button.disabled = true;

        button.textContent = "Completed ✅";

        alert("Congratulations! ₦" + reward + " added to your balance.");

      });

    });

  } catch (error) {

    taskList.innerHTML = error.message;

    console.log(error);

  }

}