const CART_KEY = "sg_cart";

// --- intern lagring ---
function read() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
  catch { return []; }
}
function write(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  return items;
}

// --- offentlige API ---
export function loadCart() {
  return read();
}
export function saveCart(items) {
  return write(items);
}

/**
 * Legg i kurv.
 * @param {object} product - serverobjekt med minst id, name, price, stock, expected_shipped
 * @param {number} qty - antall (default 1)
 * @param {number|null} resolvedPrice - hvis du allerede har regnet inn rabatt, send den inn her. Ellers brukes product.price
 */
export function addToCart(product, qty = 1, resolvedPrice = null) {
  const items = read();
  const price = Number(resolvedPrice ?? product.price ?? 0);
  const pid = product.id ?? product.product_id;
  const ix = items.findIndex(i => i.product_id === pid);

  if (ix >= 0) {
    items[ix].qty += qty;
  } else {
    items.push({
      product_id: pid,
      name: product.name ?? "Uten navn",
      price,
      qty,
      stock: Number(product.stock ?? 0),
      expected_shipped: product.expected_shipped ?? null
    });
  }
  return write(items);
}

export function updateQty(product_id, qty) {
  const items = read();
  const ix = items.findIndex(i => i.product_id === product_id);
  if (ix >= 0) {
    const next = Math.max(1, Math.trunc(Number(qty) || 1));
    items[ix].qty = next;
    write(items);
  }
  return items;
}

export function removeItem(product_id) {
  const items = read().filter(i => i.product_id !== product_id);
  return write(items);
}

export function emptyCart() {
  return write([]);
}

export function cartTotal(items = read()) {
  return items.reduce((sum, i) => sum + (Number(i.price) * Number(i.qty)), 0);
}
