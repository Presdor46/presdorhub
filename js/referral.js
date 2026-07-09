import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const totalReferrals = document.getElementById("totalReferrals");
const referralBonus = document.getElementById("referralBonus");
const referralLink = document.getElementById("referralLink");
const history = document.getElementById("history");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User data not found.");
      return;
    }

    const data = userSnap.data();

    totalReferrals.textContent = data.totalReferrals || 0;

    referralBonus.textContent =
      "₦" + (data.referralBonus || 0);

    const code =
      data.referralCode || user.uid.substring(0,8).toUpperCase();

    referralLink.value =
      "https://jocular-sorbet-ed8c51.netlify.app/register.html?ref=" + code;

    history.innerHTML = `
      <div class="history-item">
        Referral history will appear here.
      </div>
    `;

  } catch (error) {

    console.log(error);
    alert(error.message);

  }

});

window.copyReferral = function () {

  navigator.clipboard.writeText(referralLink.value);

  alert("Referral link copied successfully!");

}

window.shareWhatsApp = function () {

  const message =
`Join Presdor Hub and start earning today!

Register using my referral link:

${referralLink.value}`;

  window.open(
`https://wa.me/?text=${encodeURIComponent(message)}`,
"_blank"
  );

}