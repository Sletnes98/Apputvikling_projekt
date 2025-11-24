const username = "augustus.gloop@sukkergris.no";
const password = "laffytaffy";
export const groupKey = "ABKGYB48";

function createBasicAuthString(username, password) {
    const combinedStr = `${username}:${password}`;
    const b64 = btoa(combinedStr);
    return "basic " + b64;
};

async function getAuthToken() {
     try {
        const response = await fetch(`https://sukkergris.onrender.com/users/adminlogin?key=${groupKey}`, {
            method: "POST",
            headers: { authorization: createBasicAuthString(username, password)}
        });
        return await response.json();

    } catch (error) {
        console.error(error);
    }
};

export const authToken = (await getAuthToken()).logindata.token;

/* console.log(await getAuthToken());

console.log("Username : " + username);
console.log("Password : " + password);
console.log("Group Key : " + groupKey);
console.log("Authorization Token : " + authToken); */

//------------------------------------------------------------------------------------------------------------

export async function deleteUser(userId) {

   const response = await fetch(`https://sukkergris.onrender.com/users?key=${groupKey}&id=${userId}`, {
        method: "DELETE",
        headers: { authorization: authToken }
    });

    console.log(response);

};

//------------------------------------------------------------------------------------------------------------

