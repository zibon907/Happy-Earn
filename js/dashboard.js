document.addEventListener(
"DOMContentLoaded",
initializeDashboard
);

/* =========================
INITIALIZE
========================= */

function initializeDashboard(){

const user =
StorageService.getCurrentUser();

if(!user){

    window.location.href =
    "index.html";

    return;
}

renderUserInfo(user);

renderWallet(user);

renderVip(user);

renderReferral(user);

renderActivities(user);

bindEvents(user);

}

/* =========================
USER INFO
========================= */

function renderUserInfo(user){

const userName =
document.getElementById(
"userName"
);

const navUserName =
document.getElementById(
"navUserName"
);

const userEmail =
document.getElementById(
"userEmail"
);

if(userName){

    userName.textContent =
    user.fullName;

}

if(navUserName){

    navUserName.textContent =
    user.fullName;

}

if(userEmail){

    userEmail.textContent =
    user.email;

}

}

/* =========================
WALLET
========================= */

function renderWallet(user){

const userPoints =
document.getElementById(
"userPoints"
);

const totalPoints =
document.getElementById(
"totalPoints"
);

if(userPoints){

    userPoints.textContent =
    Number(
    user.points
    ).toLocaleString();

}

if(totalPoints){

    totalPoints.textContent =
    Number(
    user.points
    ).toLocaleString();

}

}

/* =========================
VIP
========================= */

function renderVip(user){

const vipNames = {

    0:"Bronze",

    1:"Silver",

    2:"Gold",

    3:"Platinum",

    4:"Diamond"
};

const vipTitle =
vipNames[user.vipLevel]
|| "Bronze";

const vipLevel =
document.getElementById(
"vipLevel"
);

const userVip =
document.getElementById(
"userVip"
);

if(vipLevel){

    vipLevel.textContent =
    vipTitle;

}

if(userVip){

    userVip.textContent =
    vipTitle;

}

}

/* =========================
REFERRAL
========================= */

function renderReferral(user){

const referralCode =
document.getElementById(
"referralCode"
);

const referralCount =
document.getElementById(
"referralCount"
);

if(referralCode){

    referralCode.textContent =
    user.referralCode;

}

if(referralCount){

    referralCount.textContent =
    user.totalReferrals;

}

}

/* =========================
ACTIVITIES
========================= */

function renderActivities(user){

const activityList =
document.getElementById(
"activityList"
);

const activityCount =
document.getElementById(
"activityCount"
);

if(!activityList){

    return;

}

activityList.innerHTML = "";

const activities =
user.activities || [];

if(activityCount){

    activityCount.textContent =
    activities.length;

}

if(
activities.length === 0
){

    activityList.innerHTML = `
    <div class="activity-item">

        <div class="activity-icon">
            ✓
        </div>

        <div>

            No activity found

        </div>

    </div>
    `;

    return;
}

activities
.slice()
.reverse()
.forEach(activity => {

    const item =
    document.createElement(
    "div"
    );

    item.className =
    "activity-item";

    item.innerHTML = `

    <div class="activity-icon">

        ✓

    </div>

    <div>

        <strong>

            ${activity.type}

        </strong>

        <br>

        <small>

            ${activity.description}

        </small>

    </div>

    `;

    activityList.appendChild(
    item
    );
});

}

/* =========================
EVENTS
========================= */

function bindEvents(user){

const copyButton =
document.getElementById(
"copyReferralBtn"
);

if(copyButton){

    copyButton
    .addEventListener(
    "click",
    function(){

        copyReferralCode(
        user.referralCode
        );

    }
    );

}

}

/* =========================
COPY REFERRAL
========================= */

function copyReferralCode(code){

navigator.clipboard
.writeText(code)
.then(function(){

    alert(
    "Referral code copied."
    );

});

}

/* =========================
LOGOUT
========================= */

function logout(){

AuthService.logout();

window.location.href =
"index.html";

}
