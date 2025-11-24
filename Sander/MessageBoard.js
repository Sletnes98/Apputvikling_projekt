// MessageBoard.js

const BASE_URL = "https://sukkergris.onrender.com";
const GROUP_KEY = "ABKGYB48";

// ----------------------
// HENT ALLE MELDINGER
// ----------------------
async function getMessages() {
    const url = `${BASE_URL}/msgboard/messages?key=${GROUP_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Could not load messages, status: " + response.status);
    }

    return await response.json();
}

// ----------------------
// POST NY MELDING
// ----------------------
async function postMessage(author, text) {
    const url = `${BASE_URL}/msgboard/messages?key=${GROUP_KEY}`;

    // API-dokumentasjonen for POST forteller nøyaktig hvilke felt du trenger
    const body = {
        author: author || "Anonymous",
        text: text
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
            // 🔴 IKKE authorization her – alle får skrive
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error("Post failed:", errText);
        throw new Error("Could not post message, status: " + response.status);
    }

    return await response.json();
}

// ----------------------
// RENDER MELDINGER
// ----------------------
function renderMessages(messages) {
    const container = document.getElementById("messagesContainer");
    container.innerHTML = "";

    if (!Array.isArray(messages) || messages.length === 0) {
        container.innerHTML = "<p>No messages yet.</p>";
        return;
    }

    for (const msg of messages) {
        const div = document.createElement("div");
        div.className = "message";
        div.dataset.id = msg.id; // brukes senere til delete

        const header = document.createElement("p");
        header.innerHTML = `<strong>${msg.author}</strong> wrote:`;

        const text = document.createElement("p");
        text.textContent = msg.text;

        // 🔴 Delete-knapp kan lages, men vi lar den være "passiv" inntil du har login
        /*
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.className = "delete-btn";
        */

        div.appendChild(header);
        div.appendChild(text);
        // div.appendChild(delBtn);

        container.appendChild(div);
    }
}

// ----------------------
// INIT
// ----------------------
document.addEventListener("DOMContentLoaded", async () => {
    // last inn eksisterende meldinger
    try {
        const messages = await getMessages();
        renderMessages(messages);
    } catch (err) {
        console.error(err);
        document.getElementById("messagesContainer").textContent =
            "Could not load messages.";
    }

    // håndter posting av nye meldinger
    const form = document.getElementById("messageForm");
    const authorInput = document.getElementById("author");
    const textInput = document.getElementById("text");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const author = authorInput.value.trim();
        const text = textInput.value.trim();

        if (!text) return;

        try {
            await postMessage(author, text);
            textInput.value = "";

            // last inn listen på nytt etter posting
            const messages = await getMessages();
            renderMessages(messages);
        } catch (err) {
            console.error(err);
            alert("Could not post message.");
        }
    });
});
