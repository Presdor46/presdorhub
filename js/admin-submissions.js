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

      let fullName = "Unknown User";

      try {

        const userRef = doc(db, "users", data.userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          fullName = userSnap.data().fullName || "Unknown User";
        }

      } catch (e) {
        console.log(e);
      }

      submissions.innerHTML += `
        <div class="card">

          <h3>${data.taskTitle}</h3>

          <p><strong>User:</strong> ${fullName}</p>

          <p><strong>Reward:</strong> ₦${data.reward}</p>

          <p><strong>Status:</strong> ${data.status}</p>

          <button class="approve" onclick="approveTask('${submission.id}')">
            ✅ Approve
          </button>

          <button class="reject" onclick="rejectTask('${submission.id}')">
            ❌ Reject
          </button>

        </div>
      `;

    }

  } catch (error) {

    console.error(error);

    submissions.innerHTML = "<h3>Failed to load submissions.</h3>";

    alert(error.message);

  }

}

window.approveTask = async function(id) {

  try {

    const submissionRef = doc(db, "taskSubmissions", id);

    const submissionSnap = await getDoc(submissionRef);

    if (!submissionSnap.exists()) {
      alert("Submission not found.");
      return;
    }

    const data = submissionSnap.data();

    if (data.status === "approved") {
      alert("Already approved.");
      return;
    }

    const userRef = doc(db, "users", data.userId);

    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User not found.");
      return;
    }

    const user = userSnap.data();

    const currentBalance = Number(user.balance || 0);

    const reward = Number(data.reward || 0);

    await updateDoc(userRef, {
      balance: currentBalance + reward
    });

    await updateDoc(submissionRef, {
      status: "approved"
    });

    alert("Task Approved Successfully!");

    loadSubmissions();

  } catch (error) {

    console.error(error);

    alert(error.message);

  }

};

window.rejectTask = async function(id) {

  try {

    await updateDoc(doc(db, "taskSubmissions", id), {
      status: "rejected"
    });

    alert("Task Rejected.");

    loadSubmissions();

  } catch (error) {

    console.error(error);

    alert(error.message);

  }

};

loadSubmissions();