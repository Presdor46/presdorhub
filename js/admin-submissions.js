import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const submissions = document.getElementById("submissions");

async function loadSubmissions() {

  submissions.innerHTML = "Loading...";

  try {

    const snapshot = await getDocs(collection(db, "taskSubmissions"));

    if (snapshot.empty) {
      submissions.innerHTML = "<h3>No submissions found.</h3>";
      return;
    }

    submissions.innerHTML = "";

    for (const submission of snapshot.docs) {

      const data = submission.data();

      let fullName = data.userId;

      try {

        const userSnap = await getDoc(doc(db, "users", data.userId));

        if (userSnap.exists()) {
          fullName = userSnap.data().fullName || data.userId;
        }

      } catch (e) {}

      submissions.innerHTML += `

      <div class="card">

        <h3>${data.taskTitle}</h3>

        <p><b>User:</b> ${fullName}</p>

        <p><b>Reward:</b> ₦${data.reward}</p>

        <p><b>Status:</b> ${data.status}</p>

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

    }

  } catch (error) {

    console.log(error);

    submissions.innerHTML = "<h3>Failed to load submissions.</h3>";

  }

}

window.approveTask = async function(id) {

  try {

    const submissionRef = doc(db, "taskSubmissions", id);

    const submissionSnap = await getDoc(submissionRef);

    if (!submissionSnap.exists()) return;

    const data = submissionSnap.data();

    if (data.status === "approved") {

      alert("Already approved.");

      return;

    }

    const userRef = doc(db, "users", data.userId);

    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    const user = userSnap.data();

    await updateDoc(userRef, {

      balance: (user.balance || 0) + (data.reward || 0)

    });

   