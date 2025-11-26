// ------------------------------------------------------------
let selectedID = localStorage.getItem("selectedProductId");
let productURL = `https://sukkergris.onrender.com/webshop/products?id=${selectedID}&key=ABKGYB48`;

// ------------------------------------------------------------
async function loadProduct() {
    try {
        const res = await fetch(productURL);
        const data = await res.json();
        showProduct(data[0]);
    } catch {}
}

loadProduct();

// ------------------------------------------------------------
async function loadComments(productId) {
    try {
        const res = await fetch(
            `https://sukkergris.onrender.com/webshop/comments?key=ABKGYB48&product_id=${productId}`
        );
        return await res.json();
    } catch {
        return [];
    }
}

// ------------------------------------------------------------
async function sendReviewToAPI(productId, rating, comment) {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user || !user.token) return alert("Du må være innlogget.");

    const body = {
        comment_text: comment,
        product_id: productId,
        rating: rating
    };

    try {
        const res = await fetch(
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

        const data = await res.json();
        if (data.error) return alert("Kunne ikke sende anmeldelse.");

        alert("Anmeldelse sendt!");
        loadProduct();

    } catch {
        alert("Feil ved sending av anmeldelse.");
    }
}

// ------------------------------------------------------------
async function showProduct(item) {
    const container = document.getElementById("productDetail");

    const imageUrl = item.static
        ? `https://sukkergris.onrender.com/images/GFTPOE21/large/${item.image}`
        : `https://sukkergris.onrender.com/images/ABKGYB48/large/${item.image}`;

    const ratingStars = item.rating ? "⭐".repeat(Math.round(item.rating)) : "";

    container.innerHTML = `
        <h2>${item.name}</h2>
        <img src="${imageUrl}" alt="${item.name}">
        <p><strong>Kategori:</strong> ${item.category_name}</p>
        <p><strong>Pris:</strong> ${item.price} kr</p>
        <p><strong>Beskrivelse:</strong> ${item.description}</p>
        ${item.discount > 0 ? `<p>Rabatt: ${item.discount}%</p>` : ""}
        ${item.rating ? `<p><strong>Rating:</strong> ${ratingStars}</p>` : ""}
        <button id="buyBtn">Kjøp produkt</button>
        <button class="cartBtn">Handlekurv</button>
        <button class="backBtn">Tilbake</button>
        <br><br>
    `;

    if (localStorage.getItem("userInfo")) {
        container.innerHTML += `
            <hr><br>
            <h3>Skriv en anmeldelse</h3>
            <label>Rating:</label>
            <select id="reviewRating">
                <option value="5">5 ⭐⭐⭐⭐⭐</option>
                <option value="4">4 ⭐⭐⭐⭐</option>
                <option value="3">3 ⭐⭐⭐</option>
                <option value="2">2 ⭐⭐</option>
                <option value="1">1 ⭐</option>
            </select>
            <label>Kommentar:</label>
            <textarea id="reviewComment" rows="3"></textarea>
            <button id="sendReviewBtn">Send anmeldelse</button>
            <hr>
            <h3>Anmeldelser:</h3>
            <div id="reviewList"></div>
        `;
    }

    const comments = await loadComments(item.id);
    renderReviews(comments);

    document.getElementById("buyBtn").addEventListener("click", () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push({ ...item, qty: 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Produkt lagt til i handlekurven!");
    });

    document.querySelectorAll(".cartBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            window.location.href = "../Sondre_SC/ShoppingCart.html";
        });
    });

    document.querySelectorAll(".backBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            window.location.href = "../Jonathan/Part_2/ProductList.html";
        });
    });

    if (localStorage.getItem("userInfo")) {
        document.getElementById("sendReviewBtn").addEventListener("click", () => {
            const rating = Number(document.getElementById("reviewRating").value);
            const comment = document.getElementById("reviewComment").value.trim();
            if (!comment) return alert("Skriv en kommentar.");
            sendReviewToAPI(item.id, rating, comment);
        });
    }
}

// ------------------------------------------------------------
function renderReviews(comments) {
    const listContainer = document.getElementById("reviewList");

    if (!comments || comments.length === 0) {
        listContainer.innerHTML = "<p>Ingen anmeldelser enda.</p>";
        return;
    }

    const user = JSON.parse(localStorage.getItem("userInfo"));

    listContainer.innerHTML = comments.map(comment => {
        const isMine =
            user && Number(comment.user_id) === Number(user.userid);

        const name = isMine ? user.full_name : "Anonym bruker";

        const date = comment.date
            ? new Date(comment.date).toLocaleDateString("no-NO")
            : "";

        return `
            <div style="
                border:1px solid #ccc;
                padding:10px;
                border-radius:8px;
                margin-bottom:10px;
            ">
                <p><strong>${name}</strong> – ${"⭐".repeat(comment.rating)}</p>
                <p>${comment.comment_text}</p>
                <p style="font-size:0.8rem; color:#666;">${date}</p>
            </div>
        `;
    }).join("");
}

// ------------------------------------------------------------
function setupUserThumbnail() {
    const thumb = document.getElementById("userThumb");
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (!user) {
        thumb.style.display = "none";
        return;
    }

    thumb.src = `https://sukkergris.onrender.com/images/ABKGYB48/users/${user.thumb}`;
    thumb.onclick = () => {
        window.location.href = "../../Jonathan/Task_16/editUserInfo.html";
    };
}

document.addEventListener("DOMContentLoaded", setupUserThumbnail);
