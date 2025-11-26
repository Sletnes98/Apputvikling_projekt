const userInfo = JSON.parse(localStorage.getItem("userInfo"));

const userToken = userInfo.logindata.token;


const form = document.getElementById("userInfoForm");

form.innerHTML = `
    <input type="text" id="userName" placeholder="${userInfo.logindata.username}"></input>

    <input type="text" id="fullName" placeholder="${userInfo.logindata.full_name}"></input>

    <input type="text" id="street" placeholder="${userInfo.logindata.street}"></input>

    <input type="text" id="city" placeholder="${userInfo.logindata.city}"></input>

    <input type="text" id="zipCode" placeholder="${userInfo.logindata.zipcode}"></input>

    <input type="text" id="country" placeholder="${userInfo.logindata.country}"></input>

    <img id="userThumbBig" src="https://sukkergris.onrender.com/images/ABKGYB48/users/${userInfo.logindata.thumb}"/>

    <input type="file" id="profilePicture" accept="image/*"></input>
`;

//------------------------------------------------------------------------------------------------------------

    
console.log(userInfo.logindata);

    async function deleteActiveUser(userId) {

        const response = await fetch(`https://sukkergris.onrender.com/users?key=ABKGYB48`, {
             method: "DELETE",
             headers: { authorization: userToken }
         });
     
         console.log(response);
         localStorage.removeItem("userInfo");
     
     };

//------------------------------------------------------------------------------------------------------------

const deleteUser = document.getElementById("deleteUser");
deleteUser.addEventListener("click", () => {

    console.log("User deleted!");

});

//------------------------------------------------------------------------------------------------------------

export async function editUser(username, fullname, street, city, zipcode, country, img_file) {

    const data = new FormData();

    data.append("username", username);
    data.append("fullname", fullname);
    data.append("street", street);
    data.append("city", city);
    data.append("zipcode", zipcode);
    data.append("country", country);
    data.append("img_file", img_file);

    data.entries().forEach(element => {
        console.log(element)
    });

    const response = await fetch(`https://sukkergris.onrender.com/users?key=ABKGYB48`,{
        method: "PUT",
        headers: { authorization: userToken },
        body: data
    })

    return response;

};

document.getElementById("submit").addEventListener("click", async event => {

        const username = document.getElementById("userName").value;
        const fullName = document.getElementById("fullName").value;
        const street = document.getElementById("street").value;
        const city = document.getElementById("city").value;
        const zipCode = document.getElementById("zipCode").value;
        const country = document.getElementById("country").value;
        const profilePicture = document.getElementById("profilePicture");

  
        const response = await editUser(username, fullName, street, city, zipCode, country, profilePicture.files[0]);
        console.log(response);

        // Her blir jo ikke localstorage oppdatert
        // Skal vi bare slette storage og be dem logge inn på nytt eller skal vi hente ut den nye dataen med engang?

});


//------------------------------------------------------------------------------------------------------------