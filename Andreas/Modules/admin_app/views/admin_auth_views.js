import { sanitizeString } from "../../utils.js";

//===============================================
export class AdminLoginView extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.innerHTML = `
      <h2>Admin login</h2>
      <form id="loginForm">
        <input name="username" type="email" required placeholder="email" value="augustus.gloop@sukkergris.no"><br>
        <input name="password" type="password" placeholder="password" value="laffytaffy"><br>
        <input type="submit" value="Login">
      </form>
      <div id="msg"></div>
    `;
    const form = this.shadow.querySelector("#loginForm");
    form.addEventListener("submit", evt => {
      evt.preventDefault();
      const e = new CustomEvent("adminlogin", { composed: true, bubbles: true });
        e.credentials = {
        username: form.username.value.trim(),
        password: form.password.value
        };
      this.dispatchEvent(e);
    });
  }
}

//===============================================
export class AdminMenuView extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.innerHTML = `
      <h2>Administration</h2>
      <button id="btnProducts">Products</button>
      <button id="btnOrders">Orders</button>
      <button id="btnUsers">Users</button>
      <button id="btnComments">User comments/reviews</button>
    `;
    this.shadow.querySelector("#btnProducts").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("navproducts", { composed: true, bubbles: true }));
    });
    this.shadow.querySelector("#btnOrders").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("navorders", { composed: true, bubbles: true }));
    });
    this.shadow.querySelector("#btnUsers").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("navusers", { composed: true, bubbles: true }));
    });
    this.shadow.querySelector("#btnComments").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("navcomments", { composed: true, bubbles: true }));
    });
  }
}

customElements.define("admin-login-view", AdminLoginView);
customElements.define("admin-menu-view", AdminMenuView);
