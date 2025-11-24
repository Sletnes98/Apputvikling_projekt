import { usersList, editUser } from "./userList.js";
import { groupKey, authToken } from "./adminUsers.js";


//------------------------------------------------------------------------------------------------------------

const testUser = 956;

export const user = usersList.find(user => user.id === testUser); // velg hvilken bruker du vil vise

if (user) {
    document.getElementById("userName").value = user.username;
    document.getElementById("fullName").value = user.full_name;
    document.getElementById("street").value = user.street;
    document.getElementById("city").value = user.city;
    document.getElementById("zipCode").value = user.zipcode;
    document.getElementById("country").value = user.country;
    document.getElementById("currentProfilePicture").src = `https://sukkergris.onrender.com/images/${groupKey}/users/${user.thumb}`;

};

console.log(authToken);

document.getElementById("commitEdit").addEventListener("click", async event => {
    console.log("test")
        const username = document.getElementById("userName").value;
        const fullName = document.getElementById("fullName").value;
        const street = document.getElementById("street").value;
        const city = document.getElementById("city").value;
        const zipCode = document.getElementById("zipCode").value;
        const country = document.getElementById("country").value;
        const profilePicture = document.getElementById("profilePicture");

  
        const response = await editUser(username, fullName, street, city, zipCode, country, profilePicture.files[0]);
        console.log(response);

        if (!response.ok) {
            alert("Something went wrong");
        } else {
            //window.location.href = "./listUsers.html";
            console.log("User edited!")
        }

});
