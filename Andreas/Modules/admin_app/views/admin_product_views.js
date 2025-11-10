import { sanitizeString } from "../../utils.js";

//===============================================
export class ProductListView extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({mode:"open"});
  }
  refresh(products) {
    if (!products) return;
    this.shadow.innerHTML = `<h2>Products</h2>
      <button id="btnAdd">Add product</button>
      <div id="list"></div>`;
    this.shadow.querySelector("#btnAdd").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("addnew", { composed:true, bubbles:true }));
    });

    const host = this.shadow.querySelector("#list");
    products.forEach(p => {
      const div = document.createElement("div");
      div.innerHTML = `
        <strong>${sanitizeString(p.name)}</strong> — kr ${sanitizeString(String(p.price))},-
        ${p.discount ? ` (−${sanitizeString(String(p.discount))}%)` : ""} 
        <br><small>id ${sanitizeString(String(p.id))}</small>
        <br>
        <button class="edit">Edit</button>
        <button class="del">Delete</button>
        <hr>
      `;
      host.appendChild(div);
      div.querySelector(".edit").addEventListener("click", () => {
        const e = new CustomEvent("edit", { composed:true, bubbles:true });
        e.product = p;
        this.dispatchEvent(e);
      });
      div.querySelector(".del").addEventListener("click", () => {
        const e = new CustomEvent("delete", { composed:true, bubbles:true });
        e.product = p;
        this.dispatchEvent(e);
      });
    });
  }
}

//===============================================
export class ProductForm extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({mode:"open"});
    this.shadow.innerHTML = `
      <h2 id="title">Add product</h2><hr>
      <form id="theForm">
        <input name="id" type="hidden">
        <input name="name" placeholder="Name" required><br>
        <input name="heading" placeholder="Heading"><br>
        <input name="category_id" placeholder="Category ID" required><br>
        <textarea name="description" placeholder="Description"></textarea><br>
        <input name="price" type="number" step="0.01" placeholder="Price"><br>
        <input name="discount" type="number" step="1" min="0" max="100" placeholder="Discount %"><br>
        <input name="stock" type="number" step="1" min="0" placeholder="Stock"><br>
        <input name="expected_shipped" type="date" placeholder="Expected shipped"><br>
        <label>
          <input name="reserved_members" type="checkbox"> Reserved for members
        </label><br>
        <input name="img_file" type="file" accept=".png,.jpg,.jpeg"><br><hr>
        <button type="submit" id="submitBtn">Save</button>
        <button type="button" id="cancelBtn">Cancel</button>
      </form>
    `;
    const form = this.shadow.querySelector("#theForm");
    form.addEventListener("submit", evt => {
      evt.preventDefault();
      // bygg FormData med feltnavn fra API
      const fd = new FormData();
      const f = form;
      if (f.id.value) fd.append("id", f.id.value);
      fd.append("name", f.name.value);
      if (f.heading.value) fd.append("heading", f.heading.value);
      fd.append("category_id", f.category_id.value);
      if (f.description.value) fd.append("description", f.description.value);
      if (f.price.value) fd.append("price", f.price.value);
      if (f.discount.value) fd.append("discount", f.discount.value);
      if (f.stock.value) fd.append("stock", f.stock.value);
      if (f.expected_shipped.value) fd.append("expected_shipped", f.expected_shipped.value);
      if (f.reserved_members.checked) fd.append("reserved_members", "true");
      if (f.img_file.files[0]) fd.append("img_file", f.img_file.files[0]);

      const e = new CustomEvent("saveproduct", { composed:true, bubbles:true });
      e.formData = fd;
      this.dispatchEvent(e);
    });
    this.shadow.querySelector("#cancelBtn").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("cancel", { composed:true, bubbles:true }));
    });
  }

  // kall denne for å sette form i "edit"-modus
  setEdit(product) {
    const f = this.shadow.querySelector("#theForm");
    this.shadow.querySelector("#title").textContent = "Edit product";
    f.id.value = product.id ?? "";
    f.name.value = product.name ?? "";
    f.heading.value = product.heading ?? "";
    f.category_id.value = product.category_id ?? "";
    f.description.value = product.descr ?? "";
    f.price.value = product.price ?? "";
    f.discount.value = product.discount ?? "";
    f.stock.value = product.stock ?? "";
    f.expected_shipped.value = product.expected_shipped ?? "";
    f.reserved_members.checked = !!product.reserved_members;
  }
}

customElements.define("product-list-view", ProductListView);
customElements.define("product-form", ProductForm);
