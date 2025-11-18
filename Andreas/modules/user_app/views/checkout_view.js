// modules/user_app/views/checkout_view.js
import { cartTotal } from "../State/cart_state.js";

export class CheckoutView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._cart = [];
    this._shipping = [];
    this._selShipId = null;
    this._step = 1;
    this.render();
    this._customer = null;   // holder på kundeinfo når vi bytter steg
    this._step = 1;

  }

  set data({ cart, shipping }) {
    this._cart = Array.isArray(cart) ? cart : [];
    this._shipping = Array.isArray(shipping) ? shipping : [];
    if (this._shipping.length && !this._selShipId) {
      this._selShipId = this._shipping[0].id ?? this._shipping[0].shipping_id ?? 3;
    }
    this.render();
  }

  get customer() {
    const f = this.shadowRoot.querySelector("#custForm");
    if (f) {
      // les direkte fra skjema når det finnes (steg 1)
      return {
        customer_name: f.name.value.trim(),
        email: f.email.value.trim(),
        phone: f.phone.value.trim(),
        street: f.street.value.trim(),
        zipcode: f.zip.value.trim(),
        city: f.city.value.trim(),
        country: f.country.value.trim(),
     };
    }
  // ellers bruk sist lagrede
  return this._customer ?? {
    customer_name: "", email: "", phone: "",
    street: "", zipcode: "", city: "", country: ""
  };
}


  get shippingPrice() {
    const m = this._shipping.find(s => (s.id ?? s.shipping_id) == this._selShipId);
    return Number(m?.price ?? 0);
  }

  get orderSummary() {
    const goods = cartTotal(this._cart);
    const ship = this.shippingPrice;
    return { goods, ship, total: goods + ship };
  }

  render() {
    const { goods, ship, total } = this.orderSummary;
    const shipOptions = this._shipping.map(s => {
      const id = s.id ?? s.shipping_id;
      const name = s.name ?? s.shipping_name ?? `Alt ${id}`;
      const price = Number(s.price ?? 0).toFixed(2);
      const sel = id == this._selShipId ? "selected" : "";
      return `<option value="${id}" ${sel}>${name} — kr ${price}</option>`;
    }).join("");

    const items = this._cart.map(i => `
      <tr>
        <td>${i.product_id}</td><td>${i.name}</td>
        <td style="text-align:right">${i.qty}</td>
        <td style="text-align:right">kr ${Number(i.price).toFixed(2)}</td>
        <td style="text-align:right">kr ${(i.qty * i.price).toFixed(2)}</td>
      </tr>`).join("");

    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;padding:12px;max-width:860px;margin:auto}
        header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
        nav{font-size:.95rem;opacity:.8}
        nav span{margin-right:8px}
        button{cursor:pointer}
        .row{margin:8px 0}
        table{width:100%;border-collapse:collapse;margin:8px 0}
        th,td{border-bottom:1px solid #ddd;padding:6px}
        .tot{font-weight:600}
        .right{text-align:right}
        .muted{opacity:.8}
      </style>

      <header>
        <h2>Checkout</h2>
        <button id="homeBtn">Hjem</button>
      </header>

      <nav>
        <span><b>${this._step === 1 ? "1." : "1."}</b> Kunde</span>
        <span>›</span>
        <span><b>${this._step === 2 ? "2." : "2."}</b> Frakt</span>
        <span>›</span>
        <span><b>${this._step === 3 ? "3." : "3."}</b> Oppsummering</span>
      </nav>

      ${this._step === 1 ? `
        <section class="row">
          <form id="custForm">
            <div class="row"><input id="name" name="name" placeholder="Fullt navn" required></div>
            <div class="row"><input id="email" name="email" type="email" placeholder="E-post" required></div>
            <div class="row"><input id="phone" name="phone" placeholder="Telefon"></div>
            <div class="row"><input id="street" name="street" placeholder="Gateadresse" required></div>
            <div class="row"><input id="zip" name="zip" placeholder="Postnr" required></div>
            <div class="row"><input id="city" name="city" placeholder="Poststed" required></div>
            <div class="row"><input id="country" name="country" placeholder="Land" required value="Norge"></div>
          </form>
        </section>
        <div class="row">
          <button id="next1">Neste: Velg frakt</button>
        </div>
      ` : ""}

      ${this._step === 2 ? `
        <section class="row">
          <label for="shipSel" class="row">Fraktmetode</label>
          <select id="shipSel">${shipOptions}</select>
          <p class="muted">Frakt hentes fra serveren (shippingtypes).</p>
        </section>
        <div class="row">
          <button id="back1">Tilbake</button>
          <button id="next2">Neste: Oppsummering</button>
        </div>
      ` : ""}

      ${this._step === 3 ? `
        <section class="row">
          <table>
            <thead><tr>
              <th>Varenr</th><th>Navn</th><th class="right">Ant</th><th class="right">Pris</th><th class="right">Sum</th>
            </tr></thead>
            <tbody>${items || `<tr><td colspan="5">Handlekurven er tom.</td></tr>`}</tbody>
            <tfoot>
              <tr><td colspan="4" class="right">Varer</td><td class="right">kr ${goods.toFixed(2)}</td></tr>
              <tr><td colspan="4" class="right">Frakt</td><td class="right">kr ${ship.toFixed(2)}</td></tr>
              <tr class="tot"><td colspan="4" class="right">Å betale</td><td class="right">kr ${total.toFixed(2)}</td></tr>
            </tfoot>
          </table>
        </section>
        <div class="row">
          <button id="back2">Tilbake</button>
          <button id="placeBtn">Place order</button>
        </div>
      ` : ""}
    `;

    // handlers
    this.shadowRoot.querySelector("#homeBtn")?.addEventListener("click", () =>
      this.dispatchEvent(new CustomEvent("go-home", { bubbles: true, composed: true }))
    );

          this.shadowRoot.querySelector("#next1")?.addEventListener("click", () => {
        const c = this.customer; // les fra skjema
        // enkel validering
        if (!c.customer_name || !c.email || !c.street || !c.zipcode || !c.city || !c.country) {
          return; // evt. vis feilmelding
        }
        this._customer = c;   // <- VIKTIG: lagre kundeinfo
        this._step = 2;
        this.render();
         });


    this.shadowRoot.querySelector("#shipSel")?.addEventListener("change", (e) => {
      this._selShipId = e.target.value;
    });

    this.shadowRoot.querySelector("#back1")?.addEventListener("click", () => { this._step = 1; this.render(); });
    this.shadowRoot.querySelector("#next2")?.addEventListener("click", () => { this._step = 3; this.render(); });
    this.shadowRoot.querySelector("#back2")?.addEventListener("click", () => { this._step = 2; this.render(); });

    this.shadowRoot.querySelector("#placeBtn")?.addEventListener("click", () => {
  const payload = {
    customer: this._customer || this.customer,   // <- bruk lagret kunde
    shipping_id: Number(this._selShipId),
    cart: this._cart,
    totals: this.orderSummary
  };
  this.dispatchEvent(new CustomEvent("submit-order", {
    bubbles: true, composed: true, detail: payload
  }));
});


  }
}

customElements.define("checkout-view", CheckoutView);
