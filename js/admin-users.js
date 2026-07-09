import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const usersList = document.getElementById("usersList");
const search = document.getElementById("search");

let allUsers = [];

async function loadUsers() {

  usersList.innerHTML = "Loading...";

  try {

    const snapshot = await getDocs(collection(db, "users"));

    allUsers = [];

    snapshot.forEach((user) => {

      allUsers.push({
        id: user.id,
        ...user.data()
      });

    });

    displayUsers(allUsers);

  } catch (error) {

    console.log(error);

    usersList.innerHTML = "<h3>Failed to load users.</h3>";

  }

}

function displayUsers(users) {

  usersList.innerHTML = "";

  if (users.length === 0) {

    usersList.innerHTML = "<h3>No users found.</h3>";

    return;

  }

  users.forEach((user) => {

    usersList.innerHTML += `

    <div class="card">

      <h3>${user.fullName || "No Name"}</h3>

      <p><b>Email:</b> ${user.email || ""}</p>

      <p><b>Balance:</b> ₦${user.balance || 0}</p>

      <p><b>Referrals:</b> ${user.referrals || 0}</p>

      <p><b>Admin:</b> ${user.isAdmin ? "Yes" : "No"}</p>

      <button class="admin"
      onclick="toggleAdmin('${user.id}', ${user.isAdmin})">

      ${user.isAdmin ? "Remove Admin" : "Make Admin"}

      </button>

      <button class="block"
      onclick="toggleBlock('${user.id}', ${user.blocked || false})">

      ${user.blocked ? "Unblock User" : "Block User"}

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
window.toggleAdmin = async function(id, isAdmin) {

  try {

    await updateDoc(doc(db, "users", id), {

      isAdmin: !isAdmin

    });

    alert(isAdmin ? "Admin Removed Successfully." : "User is now an Admin.");

    loadUsers();

  } catch (error) {

    console.error(error);

    alert(error.message);

  }

};

window.toggleBlock = async function(id, blocked) {

  try {

    await updateDoc(doc(db, "users", id), {

      blocked: !blocked

    });

    alert(blocked ? "User Unblocked." : "User Blocked.");

    loadUsers();

  } catch (error) {

    console.error(error);

    alert(error.message);

  }

};

loadUsers();