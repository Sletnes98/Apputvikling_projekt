import { cartTotal } from "../State/cart_state.js";

export class CartView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set data(items) {
    this._items = Array.isArray(items) ? items : [];
    this.render();
  }

  render() {
    const items = this._items || [];
    const rows = items.map((i, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>
          <div>${i.name}</div>
          ${Number(i.stock) === 0 && i.expected_shipped
            ? `<div class="muted">Forventet levering: ${new Date(i.expected_shipped).toLocaleDateString()}</div>`
            : ``}
        </td>
        <td><input data-id="${i.product_id}" type="number" min="1" value="${i.qty}" class="qty"></td>
        <td class="num">${Number(i.price).toFixed(2)}</td>
        <td class="num">${(Number(i.price) * Number(i.qty)).toFixed(2)}</td>
        <td><button data-del="${i.product_id}" class="del">Slett</button></td>
      </tr>
    `).join("");

    const total = cartTotal(items).toFixed(2);

const isEmpty = items.length === 0;
const tableHtml = isEmpty ? `
  <p>Handlekurven er tom.</p>
` : `
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Produkt</th>
        <th>Antall</th>
        <th>Pris</th>
        <th>Delsum</th>
        <th></th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr>
        <td colspan="4" class="num">Total</td>
        <td class="num">${total}</td>
        <td></td>
      </tr>
    </tfoot>
  </table>
`;

const actionsHtml = `
  <div class="actions">
    <button id="empty" ${isEmpty ? "disabled title='Ingen varer å tømme'" : ""}>Tøm handlekurv</button>
    <button id="home">Hjem</button>
    <button id="checkout" ${isEmpty ? "disabled title='Legg til varer for å gå til checkout'" : ""}>Gå til checkout</button>
  </div>
`;

this.shadowRoot.innerHTML = `
  <style>
    :host { display:block; padding:1rem; }
    h2 { margin:0 0 .75rem 0; }
    table { width:100%; border-collapse: collapse; }
    th, td { padding:.5rem; border-bottom:1px solid #eee; text-align:left; vertical-align:top; }
    .num { text-align:right; }
    .muted { font-size:.85rem; opacity:.8; }
    .actions { display:flex; gap:.5rem; margin-top:1rem; }
    .qty { width:80px; }
    tfoot td { font-weight:600; }
    button[disabled] { opacity:.6; cursor:not-allowed; }
  </style>

  <h2>Handlekurv</h2>
  ${tableHtml}
  ${actionsHtml}
`;


    // event wiring
    this.shadowRoot.querySelectorAll('input.qty').forEach(inp => {
      inp.addEventListener('change', e => {
        const pid = this._parseId(e.target.dataset.id);
        const qty = Number(e.target.value);
        this.dispatchEvent(new CustomEvent('qty-change', {
          detail: { product_id: pid, qty }, bubbles: true
        }));
      });
    });

    this.shadowRoot.querySelectorAll('button.del').forEach(btn => {
      btn.addEventListener('click', e => {
        const pid = this._parseId(e.currentTarget.dataset.del);
        this.dispatchEvent(new CustomEvent('remove-item', {
          detail: { product_id: pid }, bubbles: true
        }));
      });
    });

    this.shadowRoot.getElementById('empty')?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('empty-cart', { bubbles: true }));
    });
    this.shadowRoot.getElementById('home')?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('go-home', { bubbles: true }));
    });
    this.shadowRoot.getElementById('checkout')?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('go-checkout', { bubbles: true }));
    });
  }

  _parseId(v) {
    return (typeof v === "string" && /^\d+$/.test(v)) ? Number(v) : v;
  }
}

customElements.define('cart-view', CartView);
