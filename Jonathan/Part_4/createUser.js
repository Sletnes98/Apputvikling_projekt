import { createUser } from "./userList.js";

document.getElementById("submit").addEventListener("click", async event => {

        const username = document.getElementById("userName").value;
        const password = document.getElementById("password").value;
        const fullName = document.getElementById("fullName").value;
        const street = document.getElementById("street").value;
        const city = document.getElementById("city").value;
        const zipCode = document.getElementById("zipCode").value;
        const country = document.getElementById("country").value;
        const profilePicture = document.getElementById("profilePicture");

  
        const response = await createUser(username, password, fullName, street, city, zipCode, country, profilePicture.files[0]);
        console.log(response);

      

      /*   if (!response.ok) {
            alert("Something went wrong");
        } else {
            window.location.href = "./listUsers.html";
        } */

});
