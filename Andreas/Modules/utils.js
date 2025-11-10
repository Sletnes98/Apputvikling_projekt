// Andreas/Modules/utils.js
export function sanitizeString(str = "") {
  return String(str).replace(/[<>&"'`]/g, s => (
    { "<":"&lt;", ">":"&gt;", "&":"&amp;", "\"":"&quot;", "'":"&#39;", "`":"&#96;" }[s]
  ));
}

export async function sendRequest(url, cfg = {}) {
  const res = await fetch(url, cfg);

  // Les alltid som tekst først
  const raw = await res.text();

  // Forsøk å parse JSON uansett content-type
  let data = raw;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    // ikke JSON, behold som tekst
  }

  // Feil → kast med nyttig melding
  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && (data.msg || data.error)) ||
      raw ||
      res.statusText ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}


export function createBasicAuthString(username, password) {
  const combinedStr = `${username}:${password}`;
  const b64 = btoa(combinedStr);
  return "Basic " + b64; // stor B!
}
