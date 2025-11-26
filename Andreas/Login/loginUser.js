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

      console.log("User after login:", user);

      msg.textContent = "Welcome!";

      // Redirect KUN når innloggingen er vellykket
      setTimeout(() => {
        window.location.href = "../../Sander/HomePage.html";
      }, 300);
      console.log(user.logindata)

      // localStorage.setItem("loggedInUser", JSON.stringify(user));

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
    headers: { authorization: userToken }
  });

HEAD
  const logindata = await response.json();
  console.log("Login response:", logindata);
  let userData = await response.json();
  localStorage.setItem("userInfo", JSON.stringify(userData.logindata));

  console.log(userData);


  if (!response.ok) {
    throw new Error("Login failed: " + response.status);
  }

HEAD
  localStorage.setItem("userInfo", JSON.stringify(logindata));

  return logindata;
}

function createBasicAuthString(username, password) {
  const combinedStr = username + ":" + password;
  const b64Str = btoa(combinedStr);
  localStorage.setItem("userAuth", b64Str);
  return "basic " + b64Str; // return the basic authentication string
}

  return userData;


function createBasicAuthString(username, password) {
let combinedStr = username + ":" + password;
let b64Str = btoa(combinedStr);
localStorage.setItem("userAuth", b64Str);
return "basic " + b64Str; //return the basic authentication string
};

