import { adminLogin, listProducts, addProduct, updateProduct, deleteProduct } from "../api_service.js";
import { ProductForm, ProductListView } from "./views/admin_product_views.js";
import { AdminLoginView, AdminMenuView } from "./views/admin_auth_views.js";
import { showMessage } from "../msg_handler.js";

  

// init views ------------------------------------------------
const loginView = new AdminLoginView();
const menuView = new AdminMenuView();
const listView = new ProductListView();
const formView = new ProductForm();

const viewMap = {
  "login": loginView,
  "menu": menuView,
  "list": listView,
  "form": formView
};

const viewContainer = document.getElementById("viewContainer");

// startup: hvis ikke token → login, ellers meny
if (!sessionStorage.getItem("admin_token")) {
  navigate("login");
} else {
  navigate("menu");
}

// nav helper -----------------------------------------------
function navigate(name) {
  viewContainer.innerHTML = "";
  viewContainer.appendChild(viewMap[name]);
}

// events: login --------------------------------------------
loginView.addEventListener("adminlogin", async (evt) => {
  const { username, password } = evt.credentials;
  try {
    const data = await adminLogin(username, password);
    if (data?.token) {
      // liten visuell bekreftelse + gi DOM et pusterom før navigasjon
      showMessage("Login OK");
      console.log("Admin token:", data.token.slice(0, 12) + "..."); // se at den finnes
      setTimeout(() => navigate("menu"), 150);
    } else {
      showMessage("Login failed (no token)", "error");
    }
  } catch (err) {
    showMessage("Login failed", "error");
  }
});



// events: menu buttons -------------------------------------
menuView.addEventListener("navproducts", async () => {
  const products = await listProducts(); // alle
  listView.refresh(products);
  navigate("list");
});

// (orders/users/comments vil du koble på senere oppgaver)

// events: product list -------------------------------------
listView.addEventListener("addnew", () => {
  formView.shadow.querySelector("#theForm").reset();
  formView.shadow.querySelector("#title").textContent = "Add product";
  navigate("form");
});

listView.addEventListener("edit", (evt) => {
  formView.setEdit(evt.product);
  navigate("form");
});

listView.addEventListener("delete", async (evt) => {
  const p = evt.product;
  if (confirm(`Delete '${p.name}' (id ${p.id})?`)) {
    const res = await deleteProduct(p.id);
    if (res) showMessage("Delete OK");
    const products = await listProducts();
    listView.refresh(products);
    navigate("list");
  }
});

// events: product form -------------------------------------
formView.addEventListener("saveproduct", async (evt) => {
  const fd = evt.formData;
  const isEdit = fd.has("id") && fd.get("id");
  const res = isEdit ? await updateProduct(fd) : await addProduct(fd);
  if (res) showMessage(isEdit ? "Update OK" : "Insert OK");
  const products = await listProducts();
  listView.refresh(products);
  navigate("list");
});

formView.addEventListener("cancel", () => {
  navigate("menu");
});
