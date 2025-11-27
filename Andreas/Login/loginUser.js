// ------------------------------------------------------------
// KONFIG
// ------------------------------------------------------------
const BASE_URL = "https://sukkergris.onrender.com";
const GROUP_KEY = "ABKGYB48";


// ------------------------------------------------------------
// HJELPEFUNKSJON: BASIC AUTH
// ------------------------------------------------------------
function createBasicAuthString(username, password) {
  const combinedStr = `${username}:${password}`;
  const b64Str = btoa(combinedStr);

  // Lagre også i localStorage hvis vi vil gjenbruke senere
  localStorage.setItem("userAuth", b64Str);

  return "basic " + b64Str;
}


// ------------------------------------------------------------
// API-KALL: LOGIN SOM VANLIG BRUKER
// ------------------------------------------------------------
async function loginUser(username, password) {
  const authHeader = createBasicAuthString(username, password);

  const response = await fetch(`${BASE_URL}/users/login?key=${GROUP_KEY}`, {
    method: "POST",
    headers: { authorization: authHeader }
  });

  const data = await response.json();
  console.log("Login response:", data);

  // Forventer at token ligger inne i data.logindata.token
  const token = data?.logindata?.token;

  if (!response.ok || !token) {
    // Dersom noe er galt, kaster vi feil
    throw new Error(data.msg || "Login failed");
  }

  // Lagre hele svaret slik at andre filer kan hente ut ting på samme måte
  localStorage.setItem("userInfo", JSON.stringify(data.logindata));
  return data;
}


// ------------------------------------------------------------
// DOM: KOBLE SKJEMA OG HÅNDTERE SUBMIT
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const msg  = document.getElementById("loginMessage");

  if (!form) {
    console.error("Login form not found in HTML.");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    msg.textContent = "Logging in...";

    try {
      // Forsøker innlogging
      await loginUser(username, password);

      msg.textContent = "Login successful!";

      // Bare hvis innloggingen faktisk lykkes, går vi videre til bruker-siden
      window.location.href = "../../../sander/HomePage.html";

    } catch (error) {
      console.error(error);
      msg.textContent = "Feil brukernavn eller passord.";
    }
  });
});
