// Hent handlekurven
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.getElementById("cartContainer");
renderCart();

//---------------------------------------------------------------------
// RENDER HANDLEKURVEN
//---------------------------------------------------------------------

function renderCart() {
    container.innerHTML = "";

    if (cart.length === 0) {
    container.innerHTML = `
        <p>Handlekurven er tom.</p>
        <div class="actions">
            <button id="backBtn">Tilbake</button>
        </div>
    `;

    // Koble "Tilbake" når tom
    document.getElementById("backBtn").addEventListener("click", goBack);

    return;
}


    let table = document.createElement("table");
    table.innerHTML = `
        <thead>
            <tr>
                <th>Produkt</th>
                <th>Pris</th>
                <th>Antall</th>
                <th>Delsum</th>
                <th></th>
            </tr>
        </thead>
    `;

    let tbody = document.createElement("tbody");

    cart.forEach((item, index) => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price} kr</td>
            <td>
                <input type="number" min="1" value="${item.qty || 1}" data-index="${index}">
            </td>
            <td>${(item.price * (item.qty || 1)).toFixed(2)} kr</td>
            <td><button class="deleteBtn" data-index="${index}">🗑️</button></td>
        `;

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);

    // total
    let total = document.createElement("p");
    total.innerHTML = `<strong>Total: ${calculateTotal().toFixed(2)} kr</strong>`;
    container.appendChild(total);

    // knapper
    let actions = document.createElement("div");
    actions.classList.add("actions");
    actions.innerHTML = `
        <button id="emptyBtn">Tøm handlekurv</button>
        <button id="backBtn">Tilbake</button>
        <button id="checkoutBtn">Gå til checkout</button>
    `;
    container.appendChild(actions);

    // event listeners
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

//---------------------------------------------------------------------
// FUNKSJONER
//---------------------------------------------------------------------

function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
}

function updateQuantity(e) {
    let index = e.target.dataset.index;
    cart[index].qty = Number(e.target.value);
    saveCart();
    renderCart();
}

function deleteItem(e) {
    let index = e.target.dataset.index;
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

function emptyCart() {
    cart = [];
    saveCart();
    renderCart();
}

function goBack() {
    window.location.href = "../Jonathan/Part_2/ProductList.html";
}

function goToCheckout() {
    window.location.href = "../Jonathan/Checkout.html";
}

function goBack() {
    // Hent sist åpnet produkt
    const lastProductID = localStorage.getItem("selectedProductId");

    if (lastProductID) {
        // Gå til din ProductDetail-side
        window.location.href = "../Sondre_PD/ProductDetail.html";
    } else {
        // Hvis ingen ID finnes → gå til produktliste
        window.location.href = "../Jonathan/Part_2/ProductList.html";
    }
}



function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

//---------------------------------------------------------------------
// HEADER-KNAPPER
//---------------------------------------------------------------------

document.getElementById("homepageBtn").addEventListener("click", function () {
    window.location.href = "../Sander/HomePage.html";
});
