// Group Key : ABKGYB48

let selectedID = localStorage.getItem("selectedProductId");
let productURL = `https://sukkergris.onrender.com/webshop/products?id=${selectedID}&key=ABKGYB48`;

//-------------------------------------------------------------------------------------------------------------
// Hent produktdata
//-------------------------------------------------------------------------------------------------------------
async function loadProduct() {
    try {
        const response = await fetch(productURL);
        const data = await response.json();
        console.log(data);
        showProduct(data[0]);
    } catch (error) {
        console.log("something went wrong:", error);
    }
}
loadProduct();

//-------------------------------------------------------------------------------------------------------------
// Vis produktinformasjon
//-------------------------------------------------------------------------------------------------------------
function showProduct(item) {
    const container = document.getElementById("productDetail");

    // Bildelogikk
    const imageUrl = item.static
        ? `https://sukkergris.onrender.com/images/GFTPOE21/large/${item.image}`
        : `https://sukkergris.onrender.com/images/ABKGYB48/large/${item.image}`;

    // Datoformat
    const formattedDate = item.expected_shipped
        ? new Date(item.expected_shipped).toLocaleDateString("no-NO", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
        : "";

    // Rating-stjerner
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

        <p><strong>Lagerstatus:</strong> 
            ${item.in_stock 
                ? `På lager (${item.stock} stk)` 
                : `Utsolgt – forventet levering: ${formattedDate}`
            }
        </p>

        <button id="buyBtn">Kjøp produkt</button>
        <button class="cartBtn">Handlekurv</button>
        <button class="backBtn">Tilbake</button>
        <br><br>
    `;

    // ------------------------------------------------------------------------------------
    // TASK 14 – Review-skjema (kun når innlogget)
    // ------------------------------------------------------------------------------------
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
            <br><br>

            <h3>Anmeldelser:</h3>
            <div id="reviewList"></div>
        `;
    }

    // VIS REVIEWS
    renderReviews(item.id);

    // CART-KNAPP
    document.querySelectorAll(".cartBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            window.location.href = "../Sondre_SC/ShoppingCart.html";
        });
    });

    // KJØP-KNAPP
    document.getElementById("buyBtn").addEventListener("click", () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push({ ...item, qty: 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Produkt lagt til i handlekurven!");
    });

    // TILBAKE-KNAPP
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
            const user = JSON.parse(localStorage.getItem("userInfo"));

            if (!comment) {
                alert("Skriv en kommentar.");
                return;
            }

            // Hent eksisterende reviews
            let allReviews = JSON.parse(localStorage.getItem("reviews")) || {};

            if (!allReviews[item.id]) {
                allReviews[item.id] = [];
            }

            // Legg til ny review
            allReviews[item.id].push({
                username: user.username,
                rating: rating,
                comment: comment,
                date: new Date().toLocaleDateString("no-NO")
            });

            // Lagre tilbake
            localStorage.setItem("reviews", JSON.stringify(allReviews));

            // Tøm felt
            document.getElementById("reviewComment").value = "";

            // Oppdater visning
            renderReviews(item.id);
        });
    }
}

//-------------------------------------------------------------------------------------------------------------
// FUNKSJON: Vis anmeldelser
//-------------------------------------------------------------------------------------------------------------
function renderReviews(productId) {
    const listContainer = document.getElementById("reviewList");
    if (!listContainer) return;

    const allReviews = JSON.parse(localStorage.getItem("reviews")) || {};
    const reviews = allReviews[productId] || [];

    if (reviews.length === 0) {
        listContainer.innerHTML = "<p>Ingen anmeldelser enda.</p>";
        return;
    }

    listContainer.innerHTML = reviews.map(r => `
        <div style="border:1px solid #ccc; padding:10px; margin-bottom:10px; border-radius:8px;">
            <p><strong>${r.username}</strong> – ${"⭐".repeat(r.rating)}</p>
            <p>${r.comment}</p>
            <p style="font-size:0.8rem; color:#666;">${r.date}</p>
        </div>
    `).join("");
}

//-------------------------------------------------------------------------------------------------------------
// HEADER-KNAPP – Hjem
//-------------------------------------------------------------------------------------------------------------
document.getElementById("homepageBtn").addEventListener("click", () => {
    window.location.href = "../Sander/HomePage.html";
});

//------------------------------------------------------------
// USER LOGIN STATUS + THUMBNAIL
//------------------------------------------------------------
function setupUserThumbnail() {
    const thumb = document.getElementById("userThumb");
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) {
        thumb.style.display = "none";
        return;
    }

    const imageURL =
        `https://sukkergris.onrender.com/images/ABKGYB48/users/${userInfo.thumb}`;

    thumb.src = imageURL;
    thumb.style.cursor = "pointer";

    thumb.addEventListener("click", () => {
        window.location.href = "../../Jonathan/Task_16/editUserInfo.html";
    });
}

document.addEventListener("DOMContentLoaded", setupUserThumbnail);
