// ------------------------------------------------------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let userInfo = JSON.parse(localStorage.getItem("userInfo"));

const container = document.getElementById("CheckoutContainer");

const shippingMethods = [
  { id: 1, name: "Hent i butikk",   price: 0 },
  { id: 2, name: "Standard frakt", price: 49 },
  { id: 3, name: "Ekspressfrakt",  price: 99 }
];

renderStep1();

// ------------------------------------------------------------
function renderStep1() {
  const loggedIn = Boolean(userInfo);

  container.innerHTML = `
    <h3>1. Kundeinformasjon</h3>

    <label>Fullt navn</label>
    <input id="fullname" value="${loggedIn ? userInfo.full_name : ""}">

    <label>E-post</label>
    <input id="email" value="${loggedIn ? userInfo.username : ""}">

    <label>Tlf-nummer (valgfritt)</label>
    <input id="tlf">

    <label>Gateadresse</label>
    <input id="street" value="${loggedIn ? userInfo.street : ""}">

    <label>Postnummer</label>
    <input id="zipcode" value="${loggedIn ? userInfo.zipcode : ""}">

    <label>By</label>
    <input id="city" value="${loggedIn ? userInfo.city : ""}">

    <label>Land</label>
    <input id="country" value="${loggedIn ? userInfo.country : ""}">

    <div class="actions">
      <button id="nextBtn">Neste</button>
    </div>
  `;

  document.getElementById("nextBtn").addEventListener("click", () => {
    const info = collectCustomerInfo();
    if (!info) return alert("Vennligst fyll ut alle feltene.");
    renderStep2(info);
  });
}

// ------------------------------------------------------------
function collectCustomerInfo() {
  const fullname = document.getElementById("fullname").value.trim();
  const tlfnummer = document.getElementById("tlf").value.trim();
  const email = document.getElementById("email").value.trim();
  const street = document.getElementById("street").value.trim();
  const zipcode = document.getElementById("zipcode").value.trim();
  const city = document.getElementById("city").value.trim();
  const country = document.getElementById("country").value.trim();

  if (!fullname || !email || !street || !zipcode || !city || !country) return null;

  return { fullname, tlfnummer, email, street, zipcode, city, country };
}

// ------------------------------------------------------------
function renderStep2(customer) {
  const radios = shippingMethods.map(method => `
      <label class="shipping-option">
        <input type="radio" name="shipping" value="${method.id}">
        ${method.name} – ${method.price} kr
      </label>
    `).join("");

  container.innerHTML = `
    <h3>2. Velg fraktmetode</h3>
    ${radios}
    <div class="actions">
      <button id="backBtn">Tilbake</button>
      <button id="nextBtn">Neste</button>
    </div>
  `;

  document.getElementById("backBtn").addEventListener("click", renderStep1);

  document.getElementById("nextBtn").addEventListener("click", () => {
    const selected = document.querySelector("input[name='shipping']:checked");
    if (!selected) return alert("Velg en fraktmetode.");

    const shipping_id = Number(selected.value);
    const shipping = shippingMethods.find(s => s.id === shipping_id);

    renderStep3(customer, shipping);
  });
}

// ------------------------------------------------------------
function renderStep3(customer, shipping) {

  const itemsHtml = cart.map(item => `
      <li>${item.name} – ${item.qty} stk – ${getFinalPrice(item) * item.qty} kr</li>
  `).join("");

  const cartTotal = cart.reduce(
    (sum, i) => sum + getFinalPrice(i) * i.qty,
    0
  );

  const total = cartTotal + shipping.price;

  container.innerHTML = `
    <h2>Oppsummering</h2>

    <p><strong>Kunde:</strong> ${customer.fullname}</p>
    <p><strong>Tlf:</strong> ${customer.tlfnummer || "Ikke oppgitt"}</p>
    <p><strong>E-post:</strong> ${customer.email}</p>
    <p><strong>Adresse:</strong> ${customer.street}, ${customer.zipcode} ${customer.city}, ${customer.country}</p>

    <h4>Varer:</h4>
    <ul>${itemsHtml}</ul>

    <p><strong>Frakt:</strong> ${shipping.name} (${shipping.price} kr)</p>
    <p><strong>Total:</strong> ${total} kr</p>

    <div class="actions">
      <button id="backBtn">Tilbake</button>
      <button id="orderBtn">Fullfør bestilling</button>
    </div>
  `;

  document.getElementById("backBtn").addEventListener("click", () => renderStep2(customer));
  document.getElementById("orderBtn").addEventListener("click", () => placeOrder(customer, shipping));
}

// ------------------------------------------------------------
async function placeOrder(customer, shipping) {
  try {
    const orderlines = cart.map(item => ({
      product_id: item.id,
      qty: item.qty
    }));

    const body = {
      customer_name: customer.fullname,
      phone: customer.tlfnummer,
      street: customer.street,
      city: customer.city,
      zipcode: customer.zipcode,
      country: customer.country,
      shipping_id: shipping.id,
      content: JSON.stringify(orderlines),
      email: customer.email
    };

    const resp = await fetch(
      `https://sukkergris.onrender.com/webshop/orders?key=ABKGYB48`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      }
    );

    const apiData = await resp.json();

    const cartTotal = cart.reduce(
      (sum, i) => sum + getFinalPrice(i) * i.qty,
      0
    );

    const total = cartTotal + shipping.price;

    const orderToStore = { ...apiData, cart, total };

    localStorage.setItem("lastOrder", JSON.stringify(orderToStore));
    localStorage.removeItem("cart");

    window.location.href = "./OrderConfirmation.html";

  } catch {
    alert("Kunne ikke fullføre bestillingen.");
  }
}

// ------------------------------------------------------------
document.getElementById("homepageBtn").addEventListener("click", () => {
  window.location.href = "../Sander/HomePage.html";
});

document.getElementById("cartBtn").addEventListener("click", () => {
  window.location.href = "../Sondre_SC/ShoppingCart.html";
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

// ------------------------------------------------------------
function getFinalPrice(item) {
    if (!item.discount || item.discount <= 0) return item.price;
    return item.price - (item.price * item.discount / 100);
}
