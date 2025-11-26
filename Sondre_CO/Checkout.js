// Hent cart fra localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Fraktalternativer (B)
const shippingMethods = [
  { id: 1, name: "Hent i butikk", price: 0 },
  { id: 2, name: "Standard frakt", price: 49 },
  { id: 3, name: "Ekspressfrakt", price: 99 }
];

// Container
const container = document.getElementById("CheckoutContainer");

// Start ved steg 1
renderStep1();

//---------------------------------------------------------------------
// STEG 1 – Kundeinfo
//---------------------------------------------------------------------
function renderStep1() {
  container.innerHTML = `
    <h3>1. Kundeinformasjon</h3>
    
    <label>Fullt navn</label>
    <input id="fullname">

    <label>E-post</label>
    <input id="email">

    <label>Tlf-nummer</label>
    <input id="tlf">

    <label>Gateadresse</label>
    <input id="street">

    <label>Postnummer</label>
    <input id="zipcode">

    <label>By</label>
    <input id="city">

    <label>Land</label>
    <input id="country">

    <div class="actions">
      <button id="nextBtn">Neste</button>
    </div>
  `;

  document.getElementById("nextBtn").addEventListener("click", () => {
    const info = collectCustomerInfo();

    if (!info) {
      alert("Vennligst fyll ut alle feltene.");
      return;
    }

    renderStep2(info);
  });
}

function collectCustomerInfo() {
  const fullname = document.getElementById("fullname").value.trim();
  const tlfnummer = document.getElementById("tlf").value.trim();
  const email = document.getElementById("email").value.trim();
  const street = document.getElementById("street").value.trim();
  const zipcode = document.getElementById("zipcode").value.trim();
  const city = document.getElementById("city").value.trim();
  const country = document.getElementById("country").value.trim();

  if (!fullname || !tlfnummer || !email  || !street || !zipcode || !city || !country) return null;

  return { fullname, tlfnummer, email, street, zipcode, city, country };
}

//---------------------------------------------------------------------
// STEG 2 – Velg fraktmetode
//---------------------------------------------------------------------
function renderStep2(customer) {
  const radios = shippingMethods.map(method => `
    <label class="shipping-option">
      <input type="radio" name="shipping" value="${method.id}">
      <span>${method.name} – ${method.price} kr</span>
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

    if (!selected) {
      alert("Velg en fraktmetode.");
      return;
    }

    const shipping_id = Number(selected.value);
    const shipping = shippingMethods.find(s => s.id === shipping_id);

    renderStep3(customer, shipping);
  });
}

//---------------------------------------------------------------------
// STEG 3 – Oppsummering + Send ordre
//---------------------------------------------------------------------
function renderStep3(customer, shipping) {
  const itemsHtml = cart.map(item => `
    <li>${item.name} – ${item.qty} stk – ${item.price * item.qty} kr</li>
  `).join("");

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const total = cartTotal + shipping.price;

  container.innerHTML = `
    <h2>Oppsummering</h2>
    <br>
    <p><strong>Kunde:</strong> ${customer.fullname}</p>
    <p><strong>Tlf:</strong> ${customer.tlfnummer}</p>
    <p><strong>E-post:</strong> ${customer.email}</p>
    <p><strong>Adresse:</strong> ${customer.street}, ${customer.zipcode} ${customer.city}, ${customer.country}</p>

    <h4>Varer:</h4>
    <br>
    <ul>${itemsHtml}</ul>
    <br>
    <p><strong>Frakt:</strong> ${shipping.name} (${shipping.price} kr)</p>
    <p><strong>Total:</strong> ${total} kr</p>

    <div class="actions">
      <button id="backBtn">Tilbake</button>
      <button id="orderBtn">Fullfør bestilling</button>
    </div>
  `;

  document.getElementById("backBtn").addEventListener("click", () => renderStep2(customer));

  document.getElementById("orderBtn").addEventListener("click", () => {
    placeOrder(customer, shipping);
  });
}

//---------------------------------------------------------------------
// SEND ORDRE TIL API
//---------------------------------------------------------------------
async function placeOrder(customer, shipping) {
  try {
    // Lag orderlines til API
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

    const resp = await fetch(`https://sukkergris.onrender.com/webshop/orders?key=ABKGYB48`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const apiData = await resp.json();
    console.log("ORDER OK:", apiData);

    // regn ut total basert på cart + frakt
    const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const total = cartTotal + shipping.price;

    // lagre både API-data + cart + total i lastOrder
    const orderToStore = {
      ...apiData,  // msg + record
      cart,        // produkter med navn/pris/qty
      total        // ferdig utregnet total
    };

    localStorage.setItem("lastOrder", JSON.stringify(orderToStore));

    // Tøm handlekurv (går fint – vi har cart lagret i lastOrder nå)
    localStorage.removeItem("cart");

    // Gå til ordrebekreftelse
    window.location.href = "./OrderConfirmation.html";

  } catch (error) {
    console.error("Feil ved sending av ordre:", error);
    alert("Kunne ikke fullføre bestillingen.");
  }
}

//---------------------------------------------------------------------
// HEADER
//---------------------------------------------------------------------
document.getElementById("homepageBtn").addEventListener("click", () => {
  window.location.href = "../Sander/HomePage.html";
});

document.getElementById("cartBtn").addEventListener("click", () => {
  window.location.href = "../Sondre_SC/ShoppingCart.html";
});

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
