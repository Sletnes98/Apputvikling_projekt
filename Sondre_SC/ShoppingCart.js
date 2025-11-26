// Hent handlekurv fra localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.getElementById("cartContainer");
renderCart();

//-------------------------------------------------------------------------------------------------------------
// RENDER HANDLEKURVEN (template-style)
//-------------------------------------------------------------------------------------------------------------

function renderCart() {

    // Hvis handlekurven er tom
    if (cart.length === 0) {
        container.innerHTML = `
            <p>Handlekurven er tom.</p>
            <div class="actions">
                <button id="backBtn">Tilbake</button>
            </div>
        `;

        document.getElementById("backBtn").addEventListener("click", goBack);
        return;
    }

    // Bygg tabellen med template-string
    let rowsHTML = cart.map((item, index) => `
        <tr>
            <td>${item.name}</td>
            <td>${item.price} kr</td>
            <td>
                <input type="number" min="1" value="${item.qty || 1}" data-index="${index}">
            </td>
            <td>${(item.price * (item.qty || 1)).toFixed(2)} kr</td>
            <td><button class="deleteBtn" data-index="${index}">Slett</button></td>
        </tr>
    `).join("");

    // Sett hele HTML-en i én blokk
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Produkt</th>
                    <th>Pris</th>
                    <th>Antall</th>
                    <th>Delsum</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${rowsHTML}
            </tbody>
        </table>

        <p><strong>Total: ${calculateTotal().toFixed(2)} kr</strong></p>

        <div class="actions">
            <button id="emptyBtn">Tøm handlekurv</button>
            <button id="backBtn">Tilbake</button>
            <button id="checkoutBtn">Gå til checkout</button>
        </div>
    `;

    // Event listeners
    document.querySelectorAll("input[type='number']").forEach(input => {
        input.addEventListener("change", updateQuantity);
    });

    document.querySelectorAll(".deleteBtn").forEach(btn => {
        btn.addEventListener("click", deleteItem);
    });

    document.getElementById("emptyBtn").addEventListener("click", emptyCart);
    document.getElementById("backBtn").addEventListener("click", goBack);
    document.getElementById("checkoutBtn").addEventListener("click", goToCheckout);
}

//-------------------------------------------------------------------------------------------------------------
// FUNKSJONER
//-------------------------------------------------------------------------------------------------------------

function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
}

function updateQuantity(event) {
    let index = event.target.dataset.index;
    cart[index].qty = Number(event.target.value);
    saveCart();
    renderCart();
}

function deleteItem(event) {
    let index = event.target.dataset.index;
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

function emptyCart() {
    cart = [];
    saveCart();
    renderCart();
}

// Tilbake-knapp
function goBack() {
    const lastProductID = localStorage.getItem("selectedProductId");

    if (lastProductID) {
        window.location.href = "../Sondre_PD/ProductDetail.html";
    } else {
        window.location.href = "../Jonathan/Part_2/ProductList.html";
    }
}

function goToCheckout() {
    window.location.href = "../Sondre_CO/Checkout.html";
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

//-------------------------------------------------------------------------------------------------------------
// HEADER-KNAPP – Hjem
//-------------------------------------------------------------------------------------------------------------

document.getElementById("homepageBtn").addEventListener("click", () => {
    window.location.href = "../Sander/HomePage.html";
});

// ------------------------------------------------------------
// USER LOGIN STATUS + THUMBNAIL
// ------------------------------------------------------------

// ------------------------------------------------------------
// USER LOGIN STATUS + THUMBNAIL
// ------------------------------------------------------------
function setupUserThumbnail() {
    const thumb = document.getElementById("userThumb");
    if (!thumb) return; // hvis siden ikke har thumb

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    //  Ikke innlogget → vis login-ikon
    if (!userInfo || !userInfo.logindata) {
        thumb.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png"; // login ikon
        thumb.style.cursor = "pointer";

        thumb.addEventListener("click", () => {
            window.location.href = "../Andreas/Login/loginUser.html";
        });

        return;
    }

    // ✅ Innlogget → vis profilbilde
    const imageURL =
        `https://sukkergris.onrender.com/images/ABKGYB48/users/${userInfo.logindata.thumb}`;

    thumb.src = imageURL;
    thumb.style.cursor = "pointer";

    thumb.addEventListener("click", () => {
        window.location.href = "../../Jonathan/Task_16/editUserInfo.html";
    });
}

// Kjør funksjonen når siden laster  
document.addEventListener("DOMContentLoaded", setupUserThumbnail);