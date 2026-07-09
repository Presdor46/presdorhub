import { auth, db } from "./firebase.js";

import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tasksContainer = document.getElementById("tasks");

async function loadTasks() {

  tasksContainer.innerHTML = "Loading Tasks...";

  try {

    const snapshot = await getDocs(collection(db, "tasks"));

    tasksContainer.innerHTML = "";

    snapshot.forEach((taskDoc) => {

      const data = taskDoc.data();

      if (data.status !== true) return;

      tasksContainer.innerHTML += `

      <div class="task">

        <h2>${data.title}</h2>

        <p>${data.instructions}</p>

        <p class="reward">Reward: ₦${data.reward}</p>

        <button class="startBtn"
        onclick="window.open('${data.link}','_blank')">
        🚀 Start Task
        </button>

        <button class="submitBtn"
        onclick="submitTask('${taskDoc.id}','${data.title}',${data.reward})">
        ✅ Submit Task
        </button>

      </div>

      `;

    });

  } catch (error) {

    console.log(error);

    tasksContainer.innerHTML = "Failed to load tasks.";

  }

}

window.submitTask = async function(taskId, taskTitle, reward){

  const user = auth.currentUser;

  if(!user){

    alert("Please login first.");

    return;

  }

  try{

    const q = query(
      collection(db,"taskSubmissions"),
      where("userId","==",user.uid),
      where("taskId","==",taskId)
    );

    const existing = await getDocs(q);

    if(!existing.empty){

      alert("You have already submitted this task.");

      return;

    }

    await addDoc(
      collection(db,"taskSubmissions"),
      {

        userId:user.uid,

        taskId:taskId,

        taskTitle:taskTitle,

        reward:reward,

        status:"pending",

        submittedAt:serverTimestamp()

      }
    );

    alert("Task submitted successfully. Waiting for admin approval.");

  }catch(error){

    alert(error.message);

  }

}

loadTasks();