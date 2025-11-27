const BASE_URL = "https://sukkergris.onrender.com";
const GROUP_KEY = "ABKGYB48";

function createBasicAuthString(username, password) {
  const combinedStr = `${username}:${password}`;
  const b64Str = btoa(combinedStr);

  localStorage.setItem("userAuth", b64Str);

  return "basic " + b64Str;
}

async function loginUser(username, password) {
  const authHeader = createBasicAuthString(username, password);

  const response = await fetch(`${BASE_URL}/users/login?key=${GROUP_KEY}`, {
    method: "POST",
    headers: { authorization: authHeader }
  });

  const data = await response.json();
  console.log("Login response:", data);

  const token = data?.logindata?.token;

  if (!response.ok || !token) {
    throw new Error(data.msg || "Login failed");
  }

  localStorage.setItem("userInfo", JSON.stringify(data.logindata));
  return data;
}


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

      await loginUser(username, password);

      msg.textContent = "Login successful!";

      window.location.href = "../../../sander/HomePage.html";

    } catch (error) {
      console.error(error);
      msg.textContent = "Feil brukernavn eller passord.";
    }
  });
});
