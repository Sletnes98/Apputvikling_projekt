// Modules/error_handler.js
import { showMessage } from "./msg_handler.js";

export function errorHandler(err) {
  console.error(err);
  const msg = err?.message || "Unknown error";
  showMessage(msg, "error");
}
