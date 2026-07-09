import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const offers = document.getElementById("offers");

async function loadOffers() {

  offers.innerHTML = "Loading offers...";

  try {

    const snapshot = await getDocs(collection(db, "affiliateOffers"));

    offers.innerHTML = "";

    snapshot.forEach((doc) => {

      const data = doc.data();

      if (data.status !== true) return;

      offers.innerHTML += `

      <div class="offer">

        <img src="${data.image}" alt="${data.title}">

        <h2>${data.title}</h2>

        <p><b>Network:</b> ${data.network}</p>

        <p><b>Category:</b> ${data.category}</p>

        <p class="reward">Reward: ₦${data.reward}</p>

        <button onclick="window.open('${data.url}','_blank')">
        🚀 Start Offer
        </button>

      </div>

      `;

    });

    if (offers.innerHTML === "") {
      offers.innerHTML = "<h3>No affiliate offers available.</h3>";
    }

  } catch (error) {

    console.log(error);

    offers.innerHTML = "<h3>Failed to load offers.</h3>";

  }

}

loadOffers();