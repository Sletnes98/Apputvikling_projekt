//IMPORT
import { usersList } from "../../Jonathan/Part_4/userList.js";
import { deleteUser } from "../../Jonathan/Part_4/adminUsers.js";


// =======================================================
// KONFIGURASJON
// =======================================================
const groupkey = "ABKGYB48";           // <- din group key
const apiBase = "https://sukkergris.onrender.com";
const app = document.getElementById("app");


// =======================================================
// VISNING: LOGIN
// =======================================================
function showLogin() {
  app.innerHTML = `
    <h1>Admin Login</h1>
    <form id="loginForm">
      <input type="email" name="username" placeholder="email"
             value="augustus.gloop@sukkergris.no" required><br>
      <input type="password" name="password" placeholder="password"
             value="laffytaffy" required><br>
      <button type="submit">Login</button>
    </form>
    <div id="msg"></div>
  `;

  const form = document.getElementById("loginForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = form.username.value;
    const password = form.password.value;

    try {
      await adminLogin(username, password);
      showMenu();
    } catch (err) {
      document.getElementById("msg").textContent = err.message;
    }
  });
}


// === API: ADMIN LOGIN ===
async function adminLogin(username, password) {
  const url = `${apiBase}/users/adminlogin?key=${groupkey}`;
  const token = btoa(`${username}:${password}`);

  const res = await fetch(url, {
    method: "POST",
    headers: { authorization: "Basic " + token }
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Login failed");
  }

  const adminToken =
    data.token ||
    data.Token ||
    data?.logindata?.token;

  if (!adminToken) {
    throw new Error("No token from server");
  }

  sessionStorage.setItem("admin_token", adminToken);
  return data;
}


// =======================================================
// VISNING: MENY
// =======================================================
function showMenu() {
  app.innerHTML = `
    <h1>Administration</h1>

    <button id="btnProducts">Products</button>
    <button id="btnOrders">Orders</button>
    <button id="btnUsers">Users</button>
    <button id="btnComments">Comments</button>
    <button id="btnLogout">Logout</button>

    

    <div id="content"></div>
  `;

  document.getElementById("btnProducts").addEventListener("click", showProducts);
  document.getElementById("btnOrders").addEventListener("click", showOrders);
  document.getElementById("btnUsers").addEventListener("click", showUsers);
  document.getElementById("btnComments").addEventListener("click", showComments);

  document.getElementById("btnLogout").addEventListener("click", () => {
    sessionStorage.removeItem("admin_token");
    showLogin();
  });
}


// =======================================================
// VISNING: PRODUKTLISTE (LISTE + EDIT + DELETE + ADD)
// =======================================================
async function showProducts() {
  const content = document.getElementById("content");
  content.innerHTML = `<h2>Products</h2>`;

  let products = [];
  try {
    products = await listProducts();
  } catch (err) {
    content.innerHTML += `<p>Could not fetch products: ${err.message}</p>`;
    return;
  }

  const list = document.createElement("div");

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add product";
  addBtn.addEventListener("click", showAddProductForm);
  content.appendChild(addBtn);

  products.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${p.name}</strong> – kr ${p.price},- <br>
      id: ${p.id} <br>
      <button data-edit="${p.id}">Edit</button>
      <button data-del="${p.id}">Delete</button>
      <hr>
    `;
    list.appendChild(div);
  });

  content.appendChild(list);



  // EDIT-knapper
  content.querySelectorAll("[data-edit]").forEach(btn => {
    btn.addEventListener("click", () => {
      const product = products.find(x => x.id == btn.dataset.edit);
      if (product) {
        showEditProductForm(product);
      }
    });
  });

  // SLETT-knapper
  content.querySelectorAll("[data-del]").forEach(btn => {
    btn.addEventListener("click", async () => {
      if (confirm("Delete product?")) {
        try {
          await deleteProduct(btn.dataset.del);
          showProducts();
        } catch (err) {
          alert("Could not delete product: " + err.message);
        }
      }
    });
  });
}


// === API: LIST PRODUCTS ===
async function listProducts() {
  const url = `${apiBase}/webshop/products?key=${groupkey}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Could not fetch products");
  }

  return data; // ren JSON-liste fra serveren
}


// =======================================================
// VISNING: ADD PRODUCT – med ALLE feltene
// =======================================================
function showAddProductForm() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <h2>Add Product</h2>
    <form id="addForm">
      
      <label>Name</label>
      <input name="name" required><br>

      <label>Heading</label>
      <input name="heading"><br>

      <label>Category ID</label>
      <input name="category_id" type="number" required><br>

      <label>Description</label>
      <input name="description"><br>

      <label>Image file</label>
      <input name="img_file" type="file" accept="image/*"><br>

      <label>Price</label>
      <input name="price" type="number" required><br>

      <label>Discount (%)</label>
      <input name="discount" type="number"><br>

      <label>Carbohydrates (%)</label>
      <input name="carbohydrates" type="number"><br>

      <label>Fat (%)</label>
      <input name="fat" type="number"><br>

      <label>Protein (%)</label>
      <input name="protein" type="number"><br>

      <label>Energy (kJ per 100g)</label>
      <input name="energy" type="number"><br>

      <label>Stock</label>
      <input name="stock" type="number"><br>

      <label>Expected shipped</label>
      <input name="expected_shipped" type="date"><br>

      <label>Reserved for members only?</label>
      <select name="reserved_members">
        <option value="false" selected>No</option>
        <option value="true">Yes</option>
      </select><br><br>

      <button type="submit">Save</button>
      <button type="button" id="cancelAdd">Cancel</button>
    </form>
  `;

  document.getElementById("cancelAdd").addEventListener("click", showProducts);

  document.getElementById("addForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    await addProduct(fd);
    showProducts();
  });
}



// === API: ADD PRODUCT (POST) ===
async function addProduct(formData) {
  const url = `${apiBase}/webshop/products?key=${groupkey}`;
  const token = sessionStorage.getItem("admin_token") || "";

  const res = await fetch(url, {
    method: "POST",
    headers: { authorization: token },
    body: formData
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg || "Could not add product");
  }

  return data;
}


// =======================================================
// VISNING: EDIT PRODUCT – med ALLE feltene
// =======================================================
function showEditProductForm(product) {
  const content = document.getElementById("content");

  const desc = product.description ?? "";
  const cat = product.category_id ?? 1;
  const heading = product.heading ?? "";
  const price = product.price ?? 0;
  const discount = product.discount ?? 0;
  const carbs = product.carbohydrates ?? 60;
  const fat = product.fat ?? 20;
  const protein = product.protein ?? 20;
  const energy = product.energy ?? 2091;
  const stock = product.stock ?? 0;
  const expected = product.expected_shipped
    ? String(product.expected_shipped).slice(0, 10)
    : "";
  const reserved = product.reserved_members ?? "false";

  content.innerHTML = `
    <h2>Edit Product</h2>
    <form id="editForm">

      <input type="hidden" name="id" value="${product.id}">

      <label>Name</label>
      <input name="name" value="${product.name}" required><br>

      <label>Heading</label>
      <input name="heading" value="${heading}"><br>

      <label>Category ID</label>
      <input name="category_id" type="number" value="${cat}" required><br>

      <label>Description</label>
      <input name="description" value="${desc}"><br>

      <label>New image (optional)</label>
      <input name="img_file" type="file" accept="image/*"><br>

      <label>Price</label>
      <input name="price" type="number" value="${price}" required><br>

      <label>Discount (%)</label>
      <input name="discount" type="number" value="${discount}"><br>

      <label>Carbohydrates (%)</label>
      <input name="carbohydrates" type="number" value="${carbs}"><br>

      <label>Fat (%)</label>
      <input name="fat" type="number" value="${fat}"><br>

      <label>Protein (%)</label>
      <input name="protein" type="number" value="${protein}"><br>

      <label>Energy (kJ per 100g)</label>
      <input name="energy" type="number" value="${energy}"><br>

      <label>Stock</label>
      <input name="stock" type="number" value="${stock}"><br>

      <label>Expected shipped</label>
      <input name="expected_shipped" type="date" value="${expected}"><br>

      <label>Reserved for members only?</label>
      <select name="reserved_members">
        <option value="false" ${reserved === "false" ? "selected" : ""}>No</option>
        <option value="true" ${reserved === "true" ? "selected" : ""}>Yes</option>
      </select><br><br>

      <button type="submit">Save changes</button>
      <button type="button" id="cancelEdit">Cancel</button>
    </form>
  `;

  document.getElementById("cancelEdit").addEventListener("click", showProducts);

  document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    await updateProduct(fd);
    showProducts();
  });
}



// === API: UPDATE PRODUCT (PUT) ===
async function updateProduct(formData) {
  const url = `${apiBase}/webshop/products?key=${groupkey}`;
  const token = sessionStorage.getItem("admin_token") || "";

  const res = await fetch(url, {
    method: "PUT",
    headers: { authorization: token },
    body: formData
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg || "Could not update product");
  }

  return data;
}


// =======================================================
// API: DELETE PRODUCT (DELETE)
// =======================================================
async function deleteProduct(id) {
  const token = sessionStorage.getItem("admin_token") || "";
  const url = `${apiBase}/webshop/products?key=${groupkey}&id=${id}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: { authorization: token }
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg || "Could not delete product");
  }

  return data;
}


// =======================================================
// ENKLE VISNINGER FOR ORDERS / USERS / COMMENTS
// =======================================================
async function showOrders() {
  const content = document.getElementById("content");
  content.innerHTML = `<h2>Orders</h2><p>Laster ordre...</p>`;

  const token = sessionStorage.getItem("admin_token") || "";

  try {
    const res = await fetch(
      `${apiBase}/webshop/orders?key=${groupkey}`,
      {
        method: "GET",
        headers: { authorization: token }
      }
    );

    let data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || "Kunne ikke hente ordre");
    }

    // Noen varianter kan returnere { orders:[...] }, andre bare [...]
    const orders = Array.isArray(data) ? data : (data.orders || []);
    console.log(orders);

    if (!orders.length) {
      content.innerHTML = `<h2>Orders</h2><p>Ingen ordre registrert ennå.</p>`;
      return;
    }

    let html = `<h2>Orders</h2>`;

    orders.forEach(order => {
      // Vi er litt defensive her, siden vi ikke vet eksakt struktur på alt:
      const lines = order.orderlines || order.content || order.lines || [];

      const orderId =
        order.order_id ??
        order.id ??
        "ukjent";

      const customerName =
        order.customer_name ??
        order.customer?.customer_name ??
        "Ukjent";

      const email =
        order.email ??
        order.customer?.email ??
        "–";

      const phone =
        order.phone ??
        order.customer?.phone ??
        "–";

      const street =
        order.street ??
        order.customer?.street ??
        "";

      const zipcode =
        order.zipcode ??
        order.customer?.zipcode ??
        "";

      const city =
        order.city ??
        order.customer?.city ??
        "";

      const country =
        order.country ??
        order.customer?.country ??
        "";

      // Prøv å bruke total fra serveren – hvis ikke, regn selv fra orderlines
      let total = order.total;
      if (total == null && Array.isArray(lines) && lines.length) {
        total = lines.reduce((sum, l) => {
          const price = Number(l.price) || 0;
          const qty = Number(l.qty) || 0;
          return sum + price * qty;
        }, 0);
      }
      const totalText = total != null ? `${total} kr` : "ukjent kr";

      html += `
        <div class="order-card">
          <h3>Order #${orderId}</h3>

          <p><strong>Kunde:</strong> ${customerName}</p>
          <p><strong>E-post:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone}</p>
          <p><strong>Adresse:</strong> ${street}, ${zipcode} ${city}, ${country}</p>
          <p><strong>Total:</strong> ${totalText}</p>

          <details>
            <summary>Produkter (${lines.length})</summary>
            <ul>
              ${Array.isArray(lines) ? lines.map(l => `
                <li>
                  ${l.qty ?? "?"} x ${l.product_name ?? "Ukjent produkt"}
                  (${l.price ?? "?"} kr)
                </li>
              `).join("") : ""}
            </ul>
          </details>
        </div>
      `;
    });

    content.innerHTML = html;

  } catch (err) {
    content.innerHTML = `
      <h2>Orders</h2>
      <p>Feil ved henting av ordre: ${err.message}</p>
    `;
  }
}
// =======================================================
// START APPEN
// =======================================================
if (!sessionStorage.getItem("admin_token")) {
  showLogin();
} else {
  showMenu();
}


// =======================================================
// USERS - BRUKER usersList DU IMPORTERER
// =======================================================
function showUsers() {
  const content = document.getElementById("content");

  let html = `<h2>Users</h2>`;

  usersList.forEach(user => {
    html += `
      <div id="${user.id}">
        <img src="https://sukkergris.onrender.com/images/${groupkey}/users/${user.thumb}" alt="User image"/><br/>
        User ID : ${user.id} <br/>
        Username : ${user.username} <br/>
        Full Name : ${user.full_name} <br/>
        Street : ${user.street} <br/>
        City : ${user.city} <br/>
        Zip Code : ${user.zipcode} <br/>
        Country : ${user.country} <br/>
        <button class="delete-btn" data-id="${user.id}">Delete User</button>

      </div>
      <br/>
      <hr/>
      <br/>
    `;
    content.addEventListener("click", (event) => {
            if (event.target.classList.contains("delete-btn")) {
                const userId = event.target.dataset.id;
                deleteUser(userId);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
                
            }
        });
  });

  content.innerHTML = html;
}


// =======================================================
// COMMENTS - PLACEHOLDER
// =======================================================
function showComments() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <h2>Comments</h2>
    <p>Here we could manage user comments/reviews. Not implemented in this simplified version.</p>
  `;
}