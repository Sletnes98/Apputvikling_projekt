// ------------------------------------------------------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const container = document.getElementById("cartContainer");

renderCart();

// ------------------------------------------------------------
function renderCart() {
    if (cart.length === 0) {
        container.innerHTML = `
            <p>Handlekurven er tom.</p>
            <div class="actions"></div>
        `;
        document.getElementById("backBtn").addEventListener("click", goBack);
        return;
    }

    const rowsHTML = cart.map((item, index) => `
        <tr>
            <td>${item.name}</td>
            <td>${item.price} kr</td>
            <td>
                <input 
                    type="number" 
                    min="1" 
                    value="${item.qty || 1}" 
                    data-index="${index}">
            </td>
            <td>${(item.price * (item.qty || 1)).toFixed(2)} kr</td>
            <td><button class="deleteBtn" data-index="${index}">Slett</button></td>
        </tr>
    `).join("");

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
            <tbody>${rowsHTML}</tbody>
        </table>

        <p><strong>Total: ${calculateTotal().toFixed(2)} kr</strong></p>

        <div class="actions">
            <button id="emptyBtn">Tøm handlekurv</button>
            <button id="checkoutBtn">Gå til checkout</button>
        </div>
    `;

    document.querySelectorAll("input[type='number']").forEach(input =>
        input.addEventListener("change", updateQuantity)
    );

    document.querySelectorAll(".deleteBtn").forEach(btn =>
        btn.addEventListener("click", deleteItem)
    );

    document.getElementById("emptyBtn").addEventListener("click", emptyCart);
    document.getElementById("backBtn").addEventListener("click", goBack);
    document.getElementById("checkoutBtn").addEventListener("click", goToCheckout);
}

// ------------------------------------------------------------
function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
}

function updateQuantity(event) {
    const index = event.target.dataset.index;
    cart[index].qty = Number(event.target.value);
    saveCart();
    renderCart();
}

function deleteItem(event) {
    const index = event.target.dataset.index;
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

function emptyCart() {
    cart = [];
    saveCart();
    renderCart();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ------------------------------------------------------------
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

// ------------------------------------------------------------
document.getElementById("homepageBtn").addEventListener("click", () => {
    window.location.href = "../Sander/HomePage.html";
});

// ------------------------------------------------------------
function setupUserThumbnail() {
    const thumb = document.getElementById("userThumb");
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (!user) {
        thumb.style.display = "none";
        return;
    }

    thumb.src = `https://sukkergris.onrender.com/images/ABKGYB48/users/${user.thumb}`;
    thumb.style.cursor = "pointer";

    thumb.addEventListener("click", () => {
        window.location.href = "../../Jonathan/Task_16/editUserInfo.html";
    });
}

document.addEventListener("DOMContentLoaded", setupUserThumbnail);
