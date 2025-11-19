//IMPORT

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
      <input name="name" placeholder="Name" required><br>
      <input name="heading" placeholder="Heading"><br>
      <input name="category_id" placeholder="Category ID" type="number" required><br>
      <input name="description" placeholder="Description"><br>

      <label>Image file</label><br>
      <input name="img_file" type="file" accept="image/*"><br>

      <input name="price" placeholder="Price" type="number" required><br>
      <input name="discount" placeholder="Discount (%)" type="number"><br>
      <input name="carbohydrates" placeholder="Carbohydrates (%)" type="number"><br>
      <input name="fat" placeholder="Fat (%)" type="number"><br>
      <input name="protein" placeholder="Protein (%)" type="number"><br>
      <input name="energy" placeholder="Energy (kJ per 100g)" type="number"><br>
      <input name="stock" placeholder="Stock" type="number"><br>

      <label>Expected shipped (if stock is 0)</label><br>
      <input name="expected_shipped" type="date"><br>

      <label>Reserved for members only?</label><br>
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
    try {
      await addProduct(fd);
      showProducts();
    } catch (err) {
      alert("Could not add product: " + err.message);
    }
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

      <input name="name" placeholder="Name" value="${product.name}" required><br>
      <input name="heading" placeholder="Heading" value="${heading}"><br>
      <input name="category_id" type="number" placeholder="Category ID" value="${cat}" required><br>
      <input name="description" placeholder="Description" value="${desc}"><br>

      <label>New image (optional)</label><br>
      <input name="img_file" type="file" accept="image/*"><br>

      <input name="price" type="number" placeholder="Price" value="${price}" required><br>
      <input name="discount" type="number" placeholder="Discount (%)" value="${discount}"><br>
      <input name="carbohydrates" type="number" placeholder="Carbohydrates (%)" value="${carbs}"><br>
      <input name="fat" type="number" placeholder="Fat (%)" value="${fat}"><br>
      <input name="protein" type="number" placeholder="Protein (%)" value="${protein}"><br>
      <input name="energy" type="number" placeholder="Energy (kJ per 100g)" value="${energy}"><br>
      <input name="stock" type="number" placeholder="Stock" value="${stock}"><br>

      <label>Expected shipped</label><br>
      <input name="expected_shipped" type="date" value="${expected}"><br>

      <label>Reserved for members only?</label><br>
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
    try {
      await updateProduct(fd);
      showProducts();
    } catch (err) {
      alert("Could not update product: " + err.message);
    }
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
function showOrders() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <h2>Orders</h2>
    <p>Here we could list orders from the API. Not implemented in this simplified version.</p>
  `;
}

function showUsers() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <h2>Users</h2>
    <p>Here we could manage users. Not implemented in this simplified version.</p>
  `;
}

function showComments() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <h2>Comments</h2>
    <p>Here we could manage user comments/reviews. Not implemented in this simplified version.</p>
  `;
}


// =======================================================
// START APPEN
// =======================================================
if (!sessionStorage.getItem("admin_token")) {
  showLogin();
} else {
  showMenu();
}
