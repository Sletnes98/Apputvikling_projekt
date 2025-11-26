const userInfo = JSON.parse(localStorage.getItem("userInfo"));

const userToken = userInfo.token;


const form = document.getElementById("userInfoForm");

form.innerHTML = `
    <input type="text" id="userName" placeholder="${userInfo.username}"></input>

    <input type="text" id="fullName" placeholder="${userInfo.full_name}"></input>

    <input type="text" id="street" placeholder="${userInfo.street}"></input>

    <input type="text" id="city" placeholder="${userInfo.city}"></input>

    <input type="text" id="zipCode" placeholder="${userInfo.zipcode}"></input>

    <input type="text" id="country" placeholder="${userInfo.country}"></input>

    <img id="userThumbBig" src="https://sukkergris.onrender.com/images/ABKGYB48/users/${userInfo.thumb}"/>

    <input type="file" id="profilePicture" accept="image/*"></input>
`;

//------------------------------------------------------------------------------------------------------------

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

    if (confirm("Er du sikker på at du vil slette brukeren din?")) {

        deleteActiveUser(userInfo.id);

        setTimeout(() => {
            window.location.href = "../../Sander/HomePage.html";
        }, 2000);
    }

});

//------------------------------------------------------------------------------------------------------------

const back = document.getElementById("back");
back.addEventListener("click", () => {

    window.history.back();

});

//------------------------------------------------------------------------------------------------------------

let userInfoText = document.getElementById("userInfoText");



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

    console.log("Dataen fra PUT i editUser() ");
    const updateData = await response.json();

    const token = userToken;

    console.log(updateData.record);

    updateData.record.token = token;

    localStorage.setItem("userInfo", JSON.stringify(updateData.record));

    setTimeout(() => {
        location.reload();
    }, 1000); 


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
        //console.log(response);

        // Her blir jo ikke localstorage oppdatert
        // Skal vi bare slette storage og be dem logge inn på nytt eller skal vi hente ut den nye dataen med engang?

});


//------------------------------------------------------------------------------------------------------------