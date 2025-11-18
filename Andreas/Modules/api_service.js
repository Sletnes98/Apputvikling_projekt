import { errorHandler } from "./error_handler.js";
import { Category, Product } from "./models.js";
import { sendRequest, createBasicAuthString } from "./utils.js";

const groupkey = "ABKGYB48"; // <-- bytt til deres key

function getToken() {
  return sessionStorage.getItem("admin_token") || "";
}

//----------------------------------------------
export async function adminLogin(username, password) {
  const url = `https://sukkergris.onrender.com/users/adminlogin?key=${groupkey}`;
  const cfg = {
    method: "POST",
    headers: { authorization: createBasicAuthString(username, password) }
  };

  // les alltid som tekst, prøv å parse JSON
  const res = await fetch(url, cfg);
  const raw = await res.text();
  let json = null;
  try { json = raw ? JSON.parse(raw) : null; } catch {}

  if (!res.ok) {
    const msg =
      (json && (json.msg || json.error)) ||
      raw ||
      res.statusText ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  // <- her er den viktige endringen: token kan ligge under logindata.token
  const token =
    (json && (json.token || json.Token || json?.logindata?.token)) || null;

  if (token) {
    sessionStorage.setItem("admin_token", token);
    return { token };
  }

  throw new Error("Login failed (no token)");
}

//----------------------------------------------
// Kategorier (ekte API)
export async function getCategories() {
  const url = `https://sukkergris.onrender.com/webshop/categories?key=${groupkey}`;
  try {
    const data = await sendRequest(url);
    return data.map(row => {
      const c = new Category();
      c.setFromApiData(row);
      return c;
    });
  } catch (error) { errorHandler(error); }
}

//----------------------------------------------
// Produkter (liste)
export async function listProducts(params = {}) {
  const qs = new URLSearchParams({ key: groupkey });
  if (params.category) qs.set("category", params.category);
  if (params.search) qs.set("search", params.search);
  if (params.id) qs.set("id", params.id);

  const url = `https://sukkergris.onrender.com/webshop/products?${qs.toString()}`;

  const headers = {};
  const t = sessionStorage.getItem("admin_token");
  if (t && t.length > 10) headers.authorization = t;

  const data = await sendRequest(url, { headers });
  return data.map(row => {
    const p = new Product();
    p.setFromApiData(row);
    return p;
  });
}


//----------------------------------------------
// Add product (multipart/form-data)
export async function addProduct(formData) {
  const url = `https://sukkergris.onrender.com/webshop/products?key=${groupkey}`;
  try {
    const data = await sendRequest(url, {
      method: "POST",
      headers: { authorization: getToken() },
      body: formData
    });
    return data;
  } catch (error) { errorHandler(error); }
}

//----------------------------------------------
// Update product (multipart/form-data, må inneholde id)
export async function updateProduct(formData) {
  const url = `https://sukkergris.onrender.com/webshop/products?key=${groupkey}`;
  try {
    const data = await sendRequest(url, {
      method: "PUT",
      headers: { authorization: getToken() },
      body: formData
    });
    return data;
  } catch (error) { errorHandler(error); }
}

//----------------------------------------------
export async function deleteProduct(id) {
  const qs = new URLSearchParams({ key: groupkey, id: String(id) });
  const url = `https://sukkergris.onrender.com/webshop/products?${qs.toString()}`;
  try {
    const data = await sendRequest(url, {
      method: "DELETE",
      headers: { authorization: getToken() }
    });
    return data;
  } catch (error) { errorHandler(error); }
}

// ======================================================
// === SHIPPING & ORDER ENDPOINTS (Task 7 – Checkout) ====
// ======================================================

// Hent fraktmetoder (liste som brukes i steg 2 i checkout)
export async function listShippingTypes() {
  const url = `https://sukkergris.onrender.com/logistics/shippingtypes?key=${groupkey}`;
  try {
    // bruker vår sendRequest-wrapper som allerede håndterer feil
    return await sendRequest(url);
  } catch (error) {
    errorHandler(error);
    return [];
  }
}

// Opprett ordre (steg 3 – "Place order")
export async function addOrder(orderBody, token = null) {
  const url = `https://sukkergris.onrender.com/webshop/orders?key=${groupkey}`;
  const cfg = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: token } : {})
    },
    body: JSON.stringify(orderBody)
  };
  try {
    return await sendRequest(url, cfg);
  } catch (error) {
    errorHandler(error);
    throw error;
  }
}
