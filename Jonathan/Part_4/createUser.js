// Hent alle input-elementene
const userName = document.getElementById("userName");
const password = document.getElementById("password");
const phonenumber = document.getElementById("phoneNumber");
const fullName = document.getElementById("fullName");
const street = document.getElementById("street");
const city = document.getElementById("city");
const zipCode = document.getElementById("zipCode");
const country = document.getElementById("country");
const userProfilePicture = document.getElementById("userProfilePicture");

const submitBtn = document.getElementById("submit");

async function uploadUser() {
    const url = "https://sukkergris.onrender.com/users?key=ABKGYB48";
    const token = "eyJhbGciOiJI";

    const formData = new FormData();

    formData.append("username", userName.value);
    formData.append("password", password.value);
    formData.append("phone", phonenumber.value);
    formData.append("fullName", fullName.value);
    formData.append("street", street.value);
    formData.append("city", city.value);
    formData.append("zipCode", zipCode.value);
    formData.append("country", country.value);


    if (userProfilePicture.files.length > 0) {
        formData.append("profilePicture", userProfilePicture.files[0]);
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error("Error: " + response.status);
        }

        const data = await response.json();
        console.log("Bruker opprettet:", data);

    } catch (error) {
        console.error("Kunne ikke sende:", error);
    }
}

// Koble til knapp
submitBtn.addEventListener("click", uploadUser);
