import { auth, db } from "./firebase.js";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const submissions = document.getElementById("submissions");

async function loadSubmissions(){

  submissions.innerHTML = "Loading...";

  try{

    const snapshot = await getDocs(collection(db,"taskSubmissions"));

    submissions.innerHTML = "";

    snapshot.forEach((submission)=>{

      const data = submission.data();

      submissions.innerHTML += `

      <div class="card">

        <h3>${data.taskTitle}</h3>

        <p>User ID: ${data.userId}</p>

        <p>Reward: ₦${data.reward}</p>

        <p>Status: ${data.status}</p>

        <button class="approve"
        onclick="approveTask('${submission.id}')">

        ✅ Approve

        </button>

        <button class="reject"
        onclick="rejectTask('${submission.id}')">

        ❌ Reject

        </button>

      </div>

      `;

    });

    if(submissions.innerHTML===""){

      submissions.innerHTML="<h3>No submissions.</h3>";

    }

  }catch(error){

    console.log(error);

    submissions.innerHTML="Failed to load.";

  }

}

window.approveTask = async function(id){

  try{

    const submissionRef=doc(db,"taskSubmissions",id);

    const submission