// ===============================
// IMPORT FRA JONATHAN SINE FILER
// ===============================
import { usersList } from "../../Jonathan/Part_4/userList.js";
import { deleteUser } from "../../Jonathan/Part_4/adminUsers.js";


// ===============================
// KONSTANTER OG GLOBALT STATE
// ===============================
const groupkey = "ABKGYB48";
const apiBase = "https://sukkergris.onrender.com";
const app = document.getElementById("app");

// Vi lagrer token etter at admin har logget inn
let adminToken = sessionStorage.getItem("adminToken") || null;


// ===============================
// HJELPEFUNKSJONER
// ===============================
function createBasicAuthString(username, password) {
  const combined = `${username}:${password}`;
  const b64 = btoa(combined);
  return "basic " + b64;
}

async function adminLogin(username, password) {
  const url = `${apiBase}/users/adminlogin?key=${groupkey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { authorization: createBasicAuthString(username, password) }
  });

  const data = await response.json();
  console.log("Login response:", data);

  // Sjekker at vi faktisk fikk token tilbake
  const token =
    data?.logindata?.token ||
    data?.token ||
    data?.Token;

  if (!response.ok || !token) {
    throw new Error("Login failed");
  }

  adminToken = token;
  sessionStorage.setItem("adminToken", token);
}


// ===============================
// LOGIN-VISNING
// ===============================
function showLogin() {
  app.innerHTML = `
    <h1>Admin Login</h1>
    <form id="loginForm">
      <input
        type="email"
        name="username"
        placeholder="email"
        value="augustus.gloop@sukkergris.no"
        required
      ><br>
      <input
        type="password"
        name="password"
        placeholder="password"
        value="laffytaffy"
        required
      ><br>
      <button type="submit">Login</button>
    </form>
    <div id="msg"></div>
  `;

  const form = document.getElementById("loginForm");
  const msg = document.getElementById("msg");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    msg.textContent = "";

    const username = form.username.value;
    const password = form.password.value;

    try {
      await adminLogin(username, password);
      showMenu();
    } catch (error) {
      console.error(error);
      msg.textContent = "Feil brukernavn eller passord.";
    }
  });
}


// ===============================
// MENY / HOVED-LAYOUT
// ===============================
function showMenu() {
  app.innerHTML = `
    <h1>Sukkergris Admin</h1>

    <div class="nav-bar">
      <button id="btnProducts">Products</button>
      <button id="btnOrders">Orders</button>
      <button id="btnUsers">Users</button>
      <button id="btnComments">Comments</button>
      <button id="btnLogout">Logout</button>
    </div>

    <div id="content"></div>
  `;

  document.getElementById("btnProducts").addEventListener("click", showProducts);
  document.getElementById("btnOrders").addEventListener("click", showOrders);
  document.getElementById("btnUsers").addEventListener("click", showUsers);
  document.getElementById("btnComments").addEventListener("click", showComments);

  document.getElementById("btnLogout").addEventListener("click", () => {
    adminToken = null;
    sessionStorage.removeItem("adminToken");
    showLogin();
  });

  // Standard: vis produktene først
  showProducts();
}


// ===============================
// API-FUNKSJONER FOR PRODUKTER
// ===============================
async function getProducts() {
  const url = `${apiBase}/webshop/products?key=${groupkey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function createProduct(formData) {
  const url = `${apiBase}/webshop/products?key=${groupkey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { authorization: adminToken },
    body: formData
  });

  const data = await response.json();
  console.log("Create product:", data);

  if (!response.ok) {
    throw new Error(data.msg || "Kunne ikke opprette produkt.");
  }
}

async function updateProduct(formData) {
  const url = `${apiBase}/webshop/products?key=${groupkey}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: { authorization: adminToken },
    body: formData
  });

  const data = await response.json();
  console.log("Update product:", data);

  if (!response.ok) {
    throw new Error(data.msg || "Kunne ikke oppdatere produkt.");
  }
}

async function deleteProduct(id) {
  const url = `${apiBase}/webshop/products?key=${groupkey}&id=${id}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: { authorization: adminToken }
  });

  const data = await response.json();
  console.log("Delete product:", data);

  if (!response.ok) {
    throw new Error(data.msg || "Kunne ikke slette produkt.");
  }
}


// ===============================
// VISNING: PRODUKTER
// ===============================
async function showProducts() {
  const content = document.getElementById("content");
  content.innerHTML = "<h2>Products</h2><p>Laster produkter...</p>";

  try {
    const products = await getProducts();

    if (!Array.isArray(products) || products.length === 0) {
      content.innerHTML = "<h2>Products</h2><p>Ingen produkter funnet.</p>";
      return;
    }

    // Knapp for å legge til nytt produkt
    let html = `
      <h2>Products</h2>
      <button id="btnAddProduct">Add product</button>
      <div class="product-list">
    `;

    products.forEach((product) => {
      html += `
        <div class="product-card">
          <strong>${product.name}</strong> – kr ${product.price},- <br>
          ID: ${product.id}<br>
          Category: ${product.category_id}<br>
          <button class="edit-product" data-id="${product.id}">Edit</button>
          <button class="delete-product" data-id="${product.id}">Delete</button>
        </div>
      `;
    });

    html += "</div>";
    content.innerHTML = html;

    // Event: legg til produkt
    document
      .getElementById("btnAddProduct")
      .addEventListener("click", () => showCreateProductForm());

    // Event: rediger produkt
    document.querySelectorAll(".edit-product").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        const product = products.find((p) => p.id === id);
        if (product) {
          showEditProductForm(product);
        }
      });
    });

    // Event: slett produkt
    document.querySelectorAll(".delete-product").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (confirm("Delete product?")) {
          try {
            await deleteProduct(id);
            showProducts();
          } catch (error) {
            alert(error.message);
          }
        }
      });
    });

  } catch (error) {
    console.error(error);
    content.innerHTML = "<h2>Products</h2><p>Feil ved henting av produkter.</p>";
  }
}


// Skjema for å legge til nytt produkt
function showCreateProductForm() {
  const content = document.getElementById("content");

  content.innerHTML = `
    <h2>Add product</h2>
    <form id="productForm">

      <label>Name</label><br>
      <input name="name" required><br>

      <label>Heading</label><br>
      <input name="heading"><br>

      <label>Category ID</label><br>
      <input name="category_id" type="number" required><br>

      <label>Description</label><br>
      <input name="description"><br>

      <label>Price</label><br>
      <input name="price" type="number" required><br>

      <label>Discount</label><br>
      <input name="discount" type="number" value="0"><br>

      <label>Carbohydrates</label><br>
      <input name="carbohydrates" type="number" value="60"><br>

      <label>Fat</label><br>
      <input name="fat" type="number" value="20"><br>

      <label>Protein</label><br>
      <input name="protein" type="number" value="20"><br>

      <label>Energy</label><br>
      <input name="energy" type="number" value="2091"><br>

      <label>Stock</label><br>
      <input name="stock" type="number" value="0"><br>

      <label>Expected shipped</label><br>
      <input name="expected_shipped" type="date"><br>

      <label>Reserved members</label><br>
      <select name="reserved_members">
        <option value="false" selected>No</option>
        <option value="true">Yes</option>
      </select><br>

      <label>Image</label><br>
      <input name="image" type="file" accept="image/*"><br><br>

      <button type="submit">Save product</button>
      <button type="button" id="cancelAdd">Cancel</button>
    </form>
  `;

  document
    .getElementById("cancelAdd")
    .addEventListener("click", showProducts);

  const form = document.getElementById("productForm");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    try {
      await createProduct(formData);
      showProducts();
    } catch (error) {
      alert(error.message);
    }
  });
}


// Skjema for å redigere eksisterende produkt
function showEditProductForm(product) {
  const content = document.getElementById("content");

  const expectedDate = product.expected_shipped
    ? String(product.expected_shipped).slice(0, 10)
    : "";

  const reservedValue = product.reserved_members ? "true" : "false";

  content.innerHTML = `
    <h2>Edit product</h2>
    <form id="editForm">

      <input type="hidden" name="id" value="${product.id}">

      <label>Name</label><br>
      <input name="name" value="${product.name}" required><br>

      <label>Heading</label><br>
      <input name="heading" value="${product.heading || ""}"><br>

      <label>Category ID</label><br>
      <input name="category_id" type="number" value="${product.category_id}" required><br>

      <label>Description</label><br>
      <input name="description" value="${product.description || ""}"><br>

      <label>Price</label><br>
      <input name="price" type="number" value="${product.price}" required><br>

      <label>Discount</label><br>
      <input name="discount" type="number" value="${product.discount || 0}"><br>

      <label>Carbohydrates</label><br>
      <input name="carbohydrates" type="number" value="${product.carbohydrates || 60}"><br>

      <label>Fat</label><br>
      <input name="fat" type="number" value="${product.fat || 20}"><br>

      <label>Protein</label><br>
      <input name="protein" type="number" value="${product.protein || 20}"><br>

      <label>Energy</label><br>
      <input name="energy" type="number" value="${product.energy || 2091}"><br>

      <label>Stock</label><br>
      <input name="stock" type="number" value="${product.stock || 0}"><br>

      <label>Expected shipped</label><br>
      <input name="expected_shipped" type="date" value="${expectedDate}"><br>

      <label>Reserved members</label><br>
      <select name="reserved_members">
        <option value="false" ${reservedValue === "false" ? "selected" : ""}>No</option>
        <option value="true" ${reservedValue === "true" ? "selected" : ""}>Yes</option>
      </select><br>

      <label>Image (optional – new image)</label><br>
      <input name="image" type="file" accept="image/*"><br><br>

      <button type="submit">Save changes</button>
      <button type="button" id="cancelEdit">Cancel</button>
    </form>
  `;

  document
    .getElementById("cancelEdit")
    .addEventListener("click", showProducts);

  const form = document.getElementById("editForm");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    try {
      await updateProduct(formData);
      showProducts();
    } catch (error) {
      alert(error.message);
    }
  });
}


// ===============================
// API + VISNING: ORDRE
// ===============================
async function getOrders() {
  const url = `${apiBase}/webshop/orders?key=${groupkey}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { authorization: adminToken }
  });

  const data = await response.json();
  return data;
}

async function showOrders() {
  const content = document.getElementById("content");
  content.innerHTML = "<h2>Orders</h2><p>Laster ordre...</p>";

  try {
    const data = await getOrders();

    const orders = Array.isArray(data) ? data : (data.orders || []);
    console.log(orders);

    if (!orders.length) {
      content.innerHTML = "<h2>Orders</h2><p>Ingen ordre funnet.</p>";
      return;
    }

    let html = "<h2>Orders</h2>";

    orders.forEach((order) => {
      const lines = order.orderlines || [];

      const orderId = order.order_id || order.id || "ukjent";

      const customerName =
        order.customer_name ||
        order.full_name ||
        "Ukjent kunde";

      const email = order.email || "";
      const phone = order.phone || "";
      const address = order.street || "";
      const zipcode = order.zipcode || "";
      const city = order.city || "";
      const country = order.country || "";

      let total = order.total;
      if (total == null && Array.isArray(lines) && lines.length > 0) {
        total = lines.reduce((sum, line) => {
          const price = Number(line.price) || 0;
          const qty = Number(line.qty) || 0;
          return sum + price * qty;
        }, 0);
      }

      html += `
        <div class="order-card">
          <h3>Order #${orderId}</h3>
          <p><strong>Kunde:</strong> ${customerName}</p>
          <p><strong>E-post:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone}</p>
          <p><strong>Adresse:</strong> ${address}, ${zipcode} ${city}, ${country}</p>
          <p><strong>Total:</strong> ${total != null ? total + " kr" : "ukjent"}</p>
      `;

      if (Array.isArray(lines) && lines.length > 0) {
        html += "<p><strong>Order lines:</strong></p><ul>";
        lines.forEach((line) => {
          const name = line.name || "Ukjent produkt";
          const qty = line.qty || 1;
          const price = line.price || 0;
          html += `<li>${name} – ${qty} stk á ${price} kr</li>`;
        });
        html += "</ul>";
      }

      html += "</div>";
    });

    content.innerHTML = html;

  } catch (error) {
    console.error(error);
    content.innerHTML = "<h2>Orders</h2><p>Feil ved henting av ordre.</p>";
  }
}


// ===============================
// VISNING: USERS (BRUKER JONATHAN SITT usersList + deleteUser)
// ===============================
function showUsers() {
  const content = document.getElementById("content");
  content.innerHTML = "<h2>Users</h2>";

  if (!Array.isArray(usersList) || usersList.length === 0) {
    content.innerHTML += "<p>Ingen brukere funnet.</p>";
    return;
  }

  let html = "<h2>Users</h2>";

  usersList.forEach((user) => {
    html += `
      <div class="user-card" id="user-${user.id}">
        <img
          src="${apiBase}/images/${groupkey}/users/${user.thumb}"
          alt="User image"
        ><br>
        User ID : ${user.id} <br>
        Username : ${user.username} <br>
        Full Name : ${user.full_name} <br>
        Street : ${user.street} <br>
        City : ${user.city} <br>
        Zip Code : ${user.zipcode} <br>
        Country : ${user.country} <br>
        <button class="delete-user" data-id="${user.id}">Delete user</button>
      </div>
    `;
  });

  content.innerHTML = html;

  // Koble slette-funksjon (kommer fra Jonathan sin adminUsers.js)
  document.querySelectorAll(".delete-user").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const userId = btn.dataset.id;
      const confirmDelete = confirm("Delete this user?");

      if (!confirmDelete) {
        return;
      }

      try {
        await deleteUser(userId);
        const card = document.getElementById(`user-${userId}`);
        if (card) {
          card.remove();
        }
      } catch (error) {
        console.error(error);
        alert("Kunne ikke slette bruker.");
      }
    });
  });
}


// ===============================
// VISNING: COMMENTS (PLACEHOLDER)
// ===============================
function showComments() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <h2>Comments</h2>
    <p>Her kan vi senere vise og moderere kommentarer fra brukere.</p>
  `;
}


// ===============================
// START APP
// ===============================
if (adminToken) {
  showMenu();
} else {
  showLogin();
}
