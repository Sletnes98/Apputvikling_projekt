// ------------------------------------------------------------
const dataString = localStorage.getItem("lastOrder");
const infoContainer = document.getElementById("orderInfo");
const productContainer = document.getElementById("orderProducts");

// ------------------------------------------------------------
if (!dataString) {
    infoContainer.innerHTML = "<p>Fant ingen ordre.</p>";
} else {

    const data = JSON.parse(dataString);
    const cart = data.cart || [];

    const shippingMethods = [
        { id: 1, name: "Hent i butikk", price: 0 },
        { id: 2, name: "Standard frakt", price: 49 },
        { id: 3, name: "Ekspressfrakt", price: 99 }
    ];

    const shipping =
        shippingMethods.find(s => s.id === data.record.shipping_id) ||
        { name: "Ukjent", price: 0 };

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const total = data.total ?? (cartTotal + shipping.price);

    infoContainer.innerHTML = `
        <h2>Ordrebekreftelse</h2><br>

        <p><strong>Ordrenummer:</strong> ${data.record.ordernumber}</p>

        <h4>Kundeinformasjon</h4>
        <p><strong>Navn:</strong> ${data.record.customer_name}</p>
        <p><strong>Telefon:</strong> ${data.record.phone ?? "Ikke oppgitt"}</p>
        <p><strong>E-post:</strong> ${data.record.email}</p>
        <p><strong>Adresse:</strong> 
            ${data.record.street}, ${data.record.zipcode} 
            ${data.record.city}, ${data.record.country}
        </p>

        <br><hr><br>

        <h2>Frakt</h2><br>
        <p><strong>Metode:</strong> ${shipping.name} (${shipping.price} kr)</p>
        <p><strong>Estimert levering:</strong> ${
            data.expected_shipped
                ? new Date(data.expected_shipped).toLocaleDateString("no-NO")
                : "3–5 virkedager"
        }</p>

        <h4>Produkter:</h4><br>
    `;

    productContainer.innerHTML = `
        <ul>
            ${cart.map(item => `
                <li>
                    <strong>Navn:</strong> ${item.name}<br>
                    <strong>Antall:</strong> ${item.qty}<br>
                    <strong>Pris per:</strong> ${item.price} kr<br>
                    <strong>Delsum:</strong> ${(item.price * item.qty).toFixed(2)} kr
                </li><br>
            `).join("")}
        </ul>

        <h3>Totalpris: ${total} kr</h3>
    `;
}

// ------------------------------------------------------------
document.getElementById("homepageBtn").addEventListener("click", () => {
    window.location.href = "../Sander/HomePage.html";
});

// ------------------------------------------------------------
document.getElementById("backToCheckoutBtn").addEventListener("click", () => {
    window.location.href = "../Sondre_CO/CheckOut.html";
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
