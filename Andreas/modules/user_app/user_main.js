// modules/user_app/user_main.js
import { showMessage } from "../msg_handler.js";
import { addToCart, loadCart, updateQty, removeItem, emptyCart, cartTotal } from "./State/cart_state.js";
import { listShippingTypes, addOrder } from "../api_service.js";
import "./views/cart_view.js";
import "./views/checkout_view.js";

// Hovedcontainer fra HTML (Andreas/user_app.html)
const viewContainer = document.getElementById("viewContainer");

/* ------------------------- NAVIGASJON ------------------------- */
function navigate(hash) {
  if (location.hash !== hash) location.hash = hash;
  route();
}

function route() {
  switch (location.hash) {
    case "#/cart":
      mountCart();
      break;
    case "#/checkout":
      mountCheckout();
      break;
    default:
      mountHome();
  }
}

/* --------------------------- HOME ----------------------------- */
function mountHome() {
  const host = document.createElement("div");
  host.innerHTML = `
    <h2>Hjem</h2>
    <p>Demovisning for å teste handlekurv og checkout.</p>
    <div style="display:flex; gap:.5rem; margin:.75rem 0;">
      <button id="demoAdd">Legg til demo-produkt</button>
      <button id="gotoCart">Gå til handlekurv</button>
      <button id="gotoCheckout">Gå til checkout</button>
    </div>
  `;
  viewContainer.replaceChildren(host);

  host.querySelector("#demoAdd").addEventListener("click", () => {
    const demo = {
      id: 999001,
      name: "Demo Caramel Bar",
      price: 29.0,
      stock: 0,
      expected_shipped: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
    };
    addToCart(demo, 1);
    showMessage("Lagt i handlekurv");
  });

  host.querySelector("#gotoCart").addEventListener("click", () => navigate("#/cart"));
  host.querySelector("#gotoCheckout").addEventListener("click", () => navigate("#/checkout"));
}

/* --------------------------- CART ----------------------------- */
function mountCart() {
  const el = document.createElement("cart-view");
  el.data = loadCart();

  el.addEventListener("qty-change", (e) => {
    updateQty(e.detail.product_id, e.detail.qty);
    el.data = loadCart();
  });

  el.addEventListener("remove-item", (e) => {
    removeItem(e.detail.product_id);
    showMessage("Vare fjernet");
    el.data = loadCart();
  });

  el.addEventListener("empty-cart", () => {
    emptyCart();
    showMessage("Handlekurv tømt");
    el.data = loadCart();
  });

  el.addEventListener("go-home", () => navigate("#/"));
  el.addEventListener("go-checkout", () => navigate("#/checkout"));

  viewContainer.replaceChildren(el);
}

/* ------------------------- CHECKOUT --------------------------- */
async function mountCheckout() {
  const host = document.createElement("checkout-view");

  // Data til view: handlekurv + fraktmetoder fra server
  const cart = loadCart();
  const shipping = (await listShippingTypes()) ?? [];

  host.data = { cart, shipping };

  host.addEventListener("go-home", () => navigate("#/"));

  host.addEventListener("submit-order", async (e) => {
    const { customer, shipping_id, cart: items } = e.detail;

    // API krever content som tekstlig JSON
    const contentText = JSON.stringify(
      items.map(i => ({ product_id: i.product_id, qty: i.qty, price: i.price }))
    );

    const body = {
      customer_name: customer.customer_name,
      email:        customer.email,
      phone:        customer.phone,
      street:       customer.street,
      zipcode:      customer.zipcode,
      city:         customer.city,
      country:      customer.country,
      shipping_id:  Number(shipping_id),
      content:      contentText
    };

    try {
      const confirmation = await addOrder(body);
      emptyCart();
      showOrderConfirmation(confirmation);
    } catch (err) {
      // Feilhåndtering tas av error_handler via sendRequest; evt. legg til showMessage her.
    }
  });

  viewContainer.replaceChildren(host);
}

/* ---------------------- BEKREFTELSE --------------------------- */
function showOrderConfirmation(order) {
  const el = document.createElement("div");
  el.innerHTML = `
    <h2>Ordre bekreftet</h2>
    <p>Takk for bestillingen!</p>
    <p><b>Ordrenummer:</b> ${order?.order_number ?? order?.id ?? "-"}</p>
    <p><b>Kunde:</b> ${order?.customer_name ?? ""}</p>
    <p><b>Levering:</b> ${order?.street ?? ""}, ${order?.zipcode ?? ""} ${order?.city ?? ""}</p>
    <p><b>Fraktmetode:</b> ${order?.shipping_id ?? ""}</p>
    <div style="margin-top:12px">
      <button id="homeBtn">Hjem</button>
    </div>
  `;
  el.querySelector("#homeBtn").addEventListener("click", () => navigate("#/"));
  viewContainer.replaceChildren(el);
}

/* ------------------------ OPPSTART ---------------------------- */
window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", () => {
  if (!location.hash) location.hash = "#/";
  route();
});