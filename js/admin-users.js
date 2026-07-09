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