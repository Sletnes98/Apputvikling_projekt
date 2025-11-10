// Modules/msg_handler.js
export function showMessage(msg, type = "info") {
  const box = document.createElement("div");
  box.textContent = msg;
  box.style.position = "fixed";
  box.style.bottom = "20px";
  box.style.right = "20px";
  box.style.padding = "10px 16px";
  box.style.background = type === "error" ? "#e74c3c" : "#2ecc71";
  box.style.color = "white";
  box.style.borderRadius = "6px";
  box.style.zIndex = "9999";
  box.style.fontFamily = "sans-serif";
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 2500);
}
