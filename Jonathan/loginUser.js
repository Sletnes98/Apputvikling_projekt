document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const msg = document.getElementById("loginMessage");

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
      const user = await loginUser(username, password);

      msg.textContent = `Welcome!`;

      console.log(user.logindata)

      // Hvis du vil lagre token eller user i localStorage:
      // localStorage.setItem("loggedInUser", JSON.stringify(user));

      // Hvis du vil redirecte:
      // window.location.href = "index.html";

    } catch (error) {
      console.error(error);
      msg.textContent = "Wrong username or password.";
    }
  });
});

export async function loginUser(username, password) {
  const BASE_URL = "https://sukkergris.onrender.com";
  const GROUP_KEY = "ABKGYB48";
  const userToken = createBasicAuthString(username, password);

  const response = await fetch(`${BASE_URL}/users/login?key=${GROUP_KEY}`, {
    method: "POST",
    headers: {authorization: userToken}
  });

  let userData = await response.json();
  localStorage.setItem("userInfo", JSON.stringify(userData.logindata));

  console.log(userData);

  if (!response.ok) {
    throw new Error("Login failed: " + response.status);
  }

  return userData;
}

function createBasicAuthString(username, password) {
let combinedStr = username + ":" + password;
let b64Str = btoa(combinedStr);
localStorage.setItem("userAuth", b64Str);
return "basic " + b64Str; //return the basic authentication string
};
