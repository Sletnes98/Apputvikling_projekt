import { authToken, groupKey } from "./adminUsers.js";


async function loadUsers() {
    try {
        const response = await fetch(`https://sukkergris.onrender.com/users?key=${groupKey}`, {
            method: "GET",
            headers: { authorization: authToken }
        });

        return await response.json();

    } catch (error) {
        console.error(error);
    }
};

export const usersList = await loadUsers();

//------------------------------------------------------------------------------------------------------------

export async function createUser(username, password, fullname, street, city, zipcode, country, img_file) {

    const data = new FormData();

    data.append("username", username);
    data.append("password", password);
    data.append("fullname", fullname);
    data.append("street", street);
    data.append("city", city);
    data.append("zipcode", zipcode);
    data.append("country", country);
    data.append("img_file", img_file);

    data.entries().forEach(element => {
        console.log(element)
    });

    const response = await fetch(`https://sukkergris.onrender.com/users?key=${groupKey}`,{
        method: "POST",
        headers: { authorization: authToken },
        body: data
    })

    return response;

};

//------------------------------------------------------------------------------------------------------------