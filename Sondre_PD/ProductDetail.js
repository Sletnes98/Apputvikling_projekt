// ------------------------------------------------------------
// Produkt-endepunkt
// ------------------------------------------------------------

let selectedID = localStorage.getItem("selectedProductId");
let productURL = `https://sukkergris.onrender.com/webshop/products?id=${selectedID}&key=ABKGYB48`;


// ------------------------------------------------------------
// Last produkt + kommentarer
// ------------------------------------------------------------

async function loadProduct() {
    try {
        const response = await fetch(productURL);
        const data = await response.json();
        showProduct(data[0]);
    } catch (error) {
        console.log("Error loading product:", error);
    }
}

loadProduct();


// ------------------------------------------------------------
// LAST API-KOMMENTARER for produktet
// ------------------------------------------------------------

async function loadComments(productId) {
    try {
        const resp = await fetch(
            `https://sukkergris.onrender.com/webshop/comments?key=ABKGYB48&product_id=${productId}`
        );
        const data = await resp.json();
        return data;
    } catch (err) {
        console.log("Error loading comments:", err);
        return [];
    }
}


// ------------------------------------------------------------
// SEND REVIEW TIL API
// ------------------------------------------------------------

async function sendReviewToAPI(productId, rating, comment) {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (!user || !user.token) {
        alert("Du må være innlogget for å legge inn en anmeldelse.");
        return;
    }

    const body = {
        comment_text: comment,
        product_id: productId,
        rating: rating
    };

    try {
        const resp = await fetch(
            `https://sukkergris.onrender.com/webshop/comments?key=ABKGYB48`,
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "authorization": user.token
                },
                body: JSON.stringify(body)
            }
        );

        const data = await resp.json();
        console.log("Review posted:", data);

        if (data.error) {
            alert("Kunne ikke sende anmeldelse: " + data.error);
            return;
        }

        alert("Anmeldelse sendt!");
        loadProduct(); // last siden på nytt

    } catch (err) {
        console.error("Review error:", err);
        alert("Kunne ikke sende anmeldelsen.");
    }
}


// ------------------------------------------------------------
// VIS PRODUKT
// ------------------------------------------------------------

async function showProduct(item) {
    const container = document.getElementById("productDetail");

    // Riktig bilde-URL
    const imageUrl = item.static
        ? `https://sukkergris.onrender.com/images/GFTPOE21/large/${item.image}`
        : `https://sukkergris.onrender.com/images/ABKGYB48/large/${item.image}`;

    // Produkt-rating
    const ratingStars = item.rating ? "⭐".repeat(Math.round(item.rating)) : "";

    // HTML
    container.innerHTML = `
        <h2>${item.name}</h2>
        <img src="${imageUrl}" alt="${item.name}">
        <p><strong>Kategori:</strong> ${item.category_name}</p>
        <p><strong>Pris:</strong> ${item.price} kr</p>
        <p><strong>Beskrivelse:</strong> ${item.description}</p>

        ${item.discount > 0 ? `<p>Rabatt: ${item.discount}%</p>` : ""}
        ${item.rating ? `<p><strong>Vurdering:</strong> ${ratingStars}</p>` : ""}

        <button id="buyBtn">Kjøp produkt</button>
        <button class="cartBtn">Handlekurv</button>
        <button class="backBtn">Tilbake</button>
        <br><br>
    `;

    // ------------------------------------------------------------
    // Vis review-skjema hvis innlogget
    // ------------------------------------------------------------
    if (localStorage.getItem("userInfo")) {
        container.innerHTML += `
            <hr><br>
            <h3>Legg igjen en anmeldelse</h3>

            <label>Rating:</label>
            <select id="reviewRating">
                <option value="5">5 ⭐⭐⭐⭐⭐</option>
                <option value="4">4 ⭐⭐⭐⭐</option>
                <option value="3">3 ⭐⭐⭐</option>
                <option value="2">2 ⭐⭐</option>
                <option value="1">1 ⭐</option>
            </select>

            <label>Kommentar:</label>
            <textarea id="reviewComment" rows="3" placeholder="Skriv kommentaren din"></textarea>

            <button id="sendReviewBtn">Send anmeldelse</button>

            <hr>
            <h3>Anmeldelser:</h3>
            <div id="reviewList"></div>
        `;
    }

    // ------------------------------------------------------------
    // LAST REVIEWS FRA API OG VIS DEM
    // ------------------------------------------------------------
    const comments = await loadComments(item.id);
    renderReviews(comments);


    // ------------------------------------------------------------
    // Event listeners
    // ------------------------------------------------------------

    // Handlekurv
    document.querySelectorAll(".cartBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            window.location.href = "../Sondre_SC/ShoppingCart.html";
        });
    });

    // Kjøp
    document.getElementById("buyBtn").addEventListener("click", () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push({ ...item, qty: 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Produkt lagt til i handlekurven!");
    });

    // Tilbake
    document.querySelectorAll(".backBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            window.location.href = "../Jonathan/Part_2/ProductList.html";
        });
    });

    // SEND REVIEW
    if (localStorage.getItem("userInfo")) {
        const sendBtn = document.getElementById("sendReviewBtn");
        sendBtn.addEventListener("click", () => {
            const rating = Number(document.getElementById("reviewRating").value);
            const comment = document.getElementById("reviewComment").value.trim();

            if (!comment) {
                alert("Skriv en kommentar først.");
                return;
            }

            sendReviewToAPI(item.id, rating, comment);
        });
    }
}


// ------------------------------------------------------------
// VIS KOMMENTARER
// ------------------------------------------------------------

function renderReviews(comments) {
    const listContainer = document.getElementById("reviewList");
    if (!listContainer) return;

    if (!comments || comments.length === 0) {
        listContainer.innerHTML = "<p>Ingen anmeldelser enda.</p>";
        return;
    }

    listContainer.innerHTML = comments.map(c => `
        <div style="border:1px solid #ccc; padding:10px; border-radius:8px; margin-bottom:10px;">
            <p><strong>${c.username}</strong> – ${"⭐".repeat(c.rating)}</p>
            <p>${c.comment_text}</p>
            <p style="font-size:0.8rem; color:#666;">${new Date(c.time).toLocaleDateString("no-NO")}</p>
        </div>
    `).join("");
}


// ------------------------------------------------------------
// HEADERKNAPPER
// ------------------------------------------------------------
document.getElementById("homepageBtn").addEventListener("click", () => {
    window.location.href = "../Sander/HomePage.html";
});


// ------------------------------------------------------------
// USER THUMBNAIL
// ------------------------------------------------------------
function setupUserThumbnail() {
    const thumb = document.getElementById("userThumb");
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) {
        thumb.style.display = "none";
        return;
    }

    thumb.src = `https://sukkergris.onrender.com/images/ABKGYB48/users/${userInfo.thumb}`;
    thumb.style.cursor = "pointer";

    thumb.addEventListener("click", () => {
        window.location.href = "../../Jonathan/Task_16/editUserInfo.html";
    });
}

document.addEventListener("DOMContentLoaded", setupUserThumbnail);
