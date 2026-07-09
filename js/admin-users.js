import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const usersList = document.getElementById("usersList");
const search = document.getElementById("search");

let allUsers = [];

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  loadUsers();

});

async function loadUsers() {

  usersList.innerHTML = "Loading users...";

  try {

    const snapshot = await getDocs(collection(db, "users"));

    allUsers = [];

    snapshot.forEach((doc) => {

      allUsers.push({
        id: doc.id,
        ...doc.data()
      });

    });

    displayUsers(allUsers);

  } catch (error) {

    console.log(error);

    usersList.innerHTML = "Failed to load users.";

  }

}

function displayUsers(users) {

  if (users.length === 0) {

    usersList.innerHTML = "No users found.";

    return;

  }

  usersList.innerHTML = "";

  users.forEach((user) => {

    usersList.innerHTML += `

    <div class="user">

      <div class="name">
      ${user.fullName || "No Name"}
      </div>

      <div class="email">
      ${user.email || ""}
      </div>

      <div class="balance">
Balance: ₦${user.balance || 0}
</div>

<button onclick="editBalance('${user.id}', ${user.balance || 0})">
💰 Edit Balance
</button>
<button onclick="toggleUserStatus('${user.id}', ${user.isSuspended === true})">
${user.isSuspended ? "✅ Activate" : "🚫 Suspend"}
</button>
    </div>

    `;

  });

}

search.addEventListener("input", () => {

  const keyword = search.value.toLowerCase();

  const filtered = allUsers.filter(user =>

    (user.fullName || "").toLowerCase().includes(keyword) ||

    (user.email || "").toLowerCase().includes(keyword)

  );

  displayUsers(filtered);

});
import {
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.editBalance = async function(uid, currentBalance){

  const amount = prompt(
    "Enter new balance:",
    currentBalance
  );

  if(amount === null) return;

  try{

    await updateDoc(
      doc(db,"users",uid),
      {
        balance:Number(amount)
      }
    );

    alert("Balance updated successfully.");

    loadUsers();

  }catch(error){

    alert(error.message);

  }

}
import {
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.toggleUserStatus = async function(uid, suspended){

  try{

    await updateDoc(
      doc(db,"users",uid),
      {
        isSuspended: !suspended
      }
    );

    alert(
      suspended
      ? "User activated successfully."
      : "User suspended successfully."
    );

    loadUsers();

  }catch(error){

    alert(error.message);

  }

}