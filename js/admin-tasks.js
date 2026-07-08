import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const title = document.getElementById("title");
const reward = document.getElementById("reward");
const addTask = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

addTask.addEventListener("click", async () => {

  if (!title.value || !reward.value) {
    alert("Please fill all fields.");
    return;
  }

  try {

    await addDoc(collection(db, "tasks"), {

      title: title.value,
      reward: Number(reward.value),
      createdAt: serverTimestamp()

    });

    alert("Task Added Successfully");

    title.value = "";
    reward.value = "";

    loadTasks();

  } catch (error) {

    alert(error.message);

  }

});

async function loadTasks() {

  taskList.innerHTML = "Loading...";

  try {

    const snapshot = await getDocs(collection(db, "tasks"));

    taskList.innerHTML = "";

    if (snapshot.empty) {

      taskList.innerHTML = "<h3>No Tasks Available</h3>";
      return;

    }

    snapshot.forEach((task) => {

      const data = task.data();

      taskList.innerHTML += `

      <div class="card">

      <h3>${data.title}</h3>

      <p><strong>Reward:</strong> ₦${data.reward}</p>

      <button onclick="deleteTask('${task.id}')">

      Delete Task

      </button>

      </div>

      `;

    });

  } catch (error) {

    taskList.innerHTML = error.message;

  }

}

window.deleteTask = async (id) => {

  window.deleteTask = async (id) => {

  try {

    await deleteDoc(doc(db, "tasks", id));

    alert("Task Deleted Successfully");

    loadTasks();

  } catch (error) {

    alert(error.message);

  }

};

  try {

    await deleteDoc(doc(db, "tasks", id));

    alert("Task Deleted");

    loadTasks();

  } catch (error) {

    alert(error.message);

  }

};

loadTasks();