// ------------------------------------------------------------
// KONFIG
// ------------------------------------------------------------
const BASE_URL = "https://sukkergris.onrender.com";
const GROUP_KEY = "ABKGYB48";

// ------------------------------------------------------------
// TOKEN
// ------------------------------------------------------------
function getToken() {
    return localStorage.getItem("userAuth");
}

// ------------------------------------------------------------
// ERROR / INFO
// ------------------------------------------------------------
function showError(msg) {
    document.getElementById("errorMessage").textContent = msg;
}

function showInfo(msg) {
    document.getElementById("infoMessage").textContent = msg;
}

// ------------------------------------------------------------
// HENT MELDINGER
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
            headers: { authorization: token }
        });

        if (!response.ok) {
            showError("Could not load messages.");
            return;
        }

        const messages = await response.json();
        displayMessages(messages);

    } catch (err) {
        showError("Error loading messages: " + err.message);
    }
}

// ------------------------------------------------------------
// VIS MELDINGER
// ------------------------------------------------------------
function displayMessages(messages) {
    const container = document.getElementById("messagesContainer");
    container.innerHTML = "";

    if (!messages || messages.length === 0) {
        container.textContent = "No messages yet.";
        return;
    }

    messages.forEach(msg => {
        const box = document.createElement("div");
        box.className = "message";

        box.innerHTML = `
            <strong>${msg.heading}</strong><br>
            ${msg.message_text}<br><br>
            <small>By user ${msg.user_id} — Thread ${msg.thread}</small>
        `;

        container.appendChild(box);
    });
}

// ------------------------------------------------------------
// POST MELDING
// ------------------------------------------------------------
async function postMessage(heading, text) {
    const token = getToken();
    if (!token) {
        showError("You must log in to post messages.");
        return;
    }

    const url = `${BASE_URL}/msgboard/messages?key=${GROUP_KEY}`;

    const body = { heading, message_text: text };

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
            showError("Could not post message.");
            return;
        }

        showInfo("Message posted!");
        loadMessages();

    } catch (err) {
        showError("Error posting message: " + err.message);
    }
}

// ------------------------------------------------------------
// INIT
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {

    // HOME-KNAPP
    document.getElementById("homeBtn").addEventListener("click", () => {
        window.location.href = "./HomePage.html";  
        // endre hvis din HomePage ligger i annen mappe
    });

    // LOGIN-KNAPP (DET DU BA OM)
    document.getElementById("goToLoginBtn").addEventListener("click", () => {
        window.location.href = "../Andreas/Login/loginUser.html";  
        // eller "../Login/loginUser.html" avhengig av hvor den ligger
    });

    // POST MELDING
    document.getElementById("postMessageBtn").addEventListener("click", (e) => {
        e.preventDefault();

        const heading = document.getElementById("headingInput").value.trim();
        const text = document.getElementById("messageInput").value.trim();

        if (!heading || !text) {
            showError("Please fill in both fields.");
            return;
        }

        postMessage(heading, text);

        document.getElementById("headingInput").value = "";
        document.getElementById("messageInput").value = "";
    });

    // LAST MELDINGER
    loadMessages();
});
