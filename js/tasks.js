import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tasksContainer = document.getElementById("tasks");

async function loadTasks() {

  tasksContainer.innerHTML = "Loading Tasks...";

  try {

    const snapshot = await getDocs(collection(db, "tasks"));

    tasksContainer.innerHTML = "";

    snapshot.forEach((doc) => {

      const data = doc.data();

      if (data.status !== true) return;

      if (
        !data.title ||
        !data.instructions ||
        !data.reward ||
        !data.link
      ) return;

      tasksContainer.innerHTML += `

      <div class="task">

        <h2>${data.title}</h2>

        <p>${data.instructions}</p>

        <p class="reward">Reward: ₦${data.reward}</p>

        <button onclick="window.open('${data.link}','_blank')">
          🚀 Start Task
        </button>

      </div>

      `;

    });

    if (tasksContainer.innerHTML === "") {
      tasksContainer.innerHTML =
        "<h3>No Tasks Available.</h3>";
    }

  } catch (error) {

    console.log(error);

    tasksContainer.innerHTML =
      "<h3>Failed to load tasks.</h3>";

  }

}

loadTasks();