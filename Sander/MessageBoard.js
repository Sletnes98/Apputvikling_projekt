// ------------------------------------------------------------
// KONFIG
// ------------------------------------------------------------
const BASE_URL = "https://sukkergris.onrender.com";
const GROUP_KEY = "ABKGYB48";

// ------------------------------------------------------------
// HENT TOKEN FRA LOGIN
// ------------------------------------------------------------
function getToken() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return userInfo?.logindata?.token || null;
}

// ------------------------------------------------------------
// VIS FEIL / INFO
// ------------------------------------------------------------
function showError(msg) {
    const err = document.getElementById("errorMessage");
    const info = document.getElementById("infoMessage");
    if (err) err.textContent = msg || "";
    if (info) info.textContent = "";
}

// ------------------------------------------------------------
function showInfo(msg) {
    const err = document.getElementById("errorMessage");
    const info = document.getElementById("infoMessage");
    if (err) err.textContent = "";
    if (info) info.textContent = msg || "";
}

// ------------------------------------------------------------
// LAST INN MELDINGER (Task 17)
// ------------------------------------------------------------
async function loadMessages() {
    const token = getToken();

    if (!token) {
        showError("You must log in to view messages.");
        return;
    }

    const url = `${BASE_URL}/msgboard/messages?key=${GROUP_KEY}&all=true`;

    try {
        const response = await fetch(url, {
            headers: {
                authorization: token
            }
        });

        if (!response.ok) {
            let msg = "Could not load messages. (" + response.status + ")";
            try {
                const errData = await response.json();
                if (errData.msg) msg = errData.msg;
            } catch {
                // ignorer JSON-feil
            }
            showError(msg);
            return;
        }

        const messages = await response.json();
        displayMessages(messages);
    } catch (error) {
        showError("Network error: " + error.message);
    }
}

// ------------------------------------------------------------
// VIS MELDINGER + ENKEL RATING (Task 18)
// ------------------------------------------------------------
function displayMessages(messages) {
    const container = document.getElementById("messagesContainer");
    container.innerHTML = "";

    if (!Array.isArray(messages) || messages.length === 0) {
        container.textContent = "No messages yet.";
        return;
    }

    messages.forEach(msg => {
        const box = document.createElement("div");
        box.className = "message";

        // prøv begge felt, avhengig av hvordan serveren heter dem
        const text = msg.message_text || msg.message || "";

        box.innerHTML = `
            <strong>${msg.heading}</strong><br>
            ${text}<br>
            <small>By user ${msg.user_id} — Thread ${msg.thread}</small>
            <div class="rating">
                Rate user:
                <button data-user="${msg.user_id}" data-rating="1">⭐</button>
                <button data-user="${msg.user_id}" data-rating="2">⭐⭐</button>
                <button data-user="${msg.user_id}" data-rating="3">⭐⭐⭐</button>
                <button data-user="${msg.user_id}" data-rating="4">⭐⭐⭐⭐</button>
                <button data-user="${msg.user_id}" data-rating="5">⭐⭐⭐⭐⭐</button>
            </div>
        `;

        container.appendChild(box);
    });

    // legg til klikk på rating-knappene
    container.querySelectorAll(".rating button").forEach(btn => {
        btn.addEventListener("click", () => {
            const userId = btn.dataset.user;
            const rating = btn.dataset.rating;
            rateUser(userId, rating);
        });
    });
}

// ------------------------------------------------------------
// POST NY MELDING
// ------------------------------------------------------------
async function postMessage(heading, text) {
    const token = getToken();

    if (!token) {
        showError("You must log in to post messages.");
        return;
    }

    const url = `${BASE_URL}/msgboard/messages?key=${GROUP_KEY}`;
    const body = {
        heading: heading,
        message_text: text
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                authorization: token
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            let msg = "Could not post message. (" + response.status + ")";
            try {
                const errData = await response.json();
                if (errData.msg) msg = errData.msg;
            } catch {
                // ignorer JSON-feil
            }
            showError(msg);
            return;
        }

        showInfo("Message posted!");
        clearForm();
        await loadMessages();
    } catch (error) {
        showError("Network error: " + error.message);
    }
}

// ------------------------------------------------------------
// RATE EN BRUKER (MeowMeowBeenz)
// ------------------------------------------------------------
async function rateUser(userId, rating) {
    const token = getToken();

    if (!token) {
        showError("You must log in to rate users.");
        return;
    }

    const url = `${BASE_URL}/users/beenz?key=${GROUP_KEY}`;
    const body = {
        userid: Number(userId),
        beenz: Number(rating)
    };

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
                authorization: token
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            let msg = "Could not rate user. (" + response.status + ")";
            try {
                const errData = await response.json();
                if (errData.msg) msg = errData.msg;
            } catch {
                // ignorer JSON-feil
            }
            showError(msg);
            return;
        }

        showInfo(`You rated user ${userId} with ${rating} stars!`);
    } catch (error) {
        showError("Error rating user: " + error.message);
    }
}

// ------------------------------------------------------------
// RYDD SKJEMA
// ------------------------------------------------------------
function clearForm() {
    const headingInput = document.getElementById("headingInput");
    const messageInput = document.getElementById("messageInput");

    if (headingInput) headingInput.value = "";
    if (messageInput) messageInput.value = "";
}

// ------------------------------------------------------------
// NAV-KNAPPER
// ------------------------------------------------------------
function setupNavigation() {
    const homeBtn = document.getElementById("homeBtn");
    const cartBtn = document.getElementById("cartBtn");
    const loginBtn = document.getElementById("loginBtn");

    if (homeBtn) {
        homeBtn.addEventListener("click", () => {
            window.location.href = "HomePage.html";
        });
    }

    if (cartBtn) {
        cartBtn.addEventListener("click", () => {
            window.location.href = "../Sondre_SC/ShoppingCart.html";
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            window.location.href = "../Andreas/Login/loginUser.html";
        });
    }
}

// ------------------------------------------------------------
// BRUKERBILDE PÅ MESSAGE BOARD
// ------------------------------------------------------------
function setupUserThumbnailMessageBoard() {
    const thumb = document.getElementById("userThumb");
    if (!thumb) return;

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo || !userInfo.logindata) {
        thumb.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
        thumb.style.cursor = "pointer";

        thumb.addEventListener("click", () => {
            window.location.href = "../Andreas/Login/loginUser.html";
        });

        return;
    }

    const imageURL =
        `https://sukkergris.onrender.com/images/ABKGYB48/users/${userInfo.logindata.thumb}`;

    thumb.src = imageURL;
    thumb.style.cursor = "pointer";

    thumb.addEventListener("click", () => {
        window.location.href = "../Jonathan/Task_16/editUserInfo.html";
    });
}

// ------------------------------------------------------------
// INIT – KJØRES NÅR SIDEN LASTER
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    setupUserThumbnailMessageBoard();
    loadMessages();

    const form = document.getElementById("messageForm");
    if (form) {
        form.addEventListener("submit", event => {
            event.preventDefault();

            const heading = document.getElementById("headingInput").value.trim();
            const text = document.getElementById("messageInput").value.trim();

            if (!heading || !text) {
                showError("Please fill in both fields.");
                return;
            }

            postMessage(heading, text);
        });
    }
});
