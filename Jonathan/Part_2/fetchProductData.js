const groupKey =  "ABKGYB48";

let testID = 3;
let selectedID = localStorage.getItem("selectedCategoryId");
let checkURL = `https://sukkergris.onrender.com/webshop/products?category=${selectedID}&key=${groupKey}`;
let checkData;

/* const test = JSON.parse(localStorage.getItem("userInfo"));

const test2 = null;

console.log(test.token); */


export async function loadData() {

    try {

       /*  let response = await fetch(checkURL, {
            headers: { authorization: test.token }

        }); */

        let response = await fetch(checkURL);

        checkData = await response.json();

        console.log(checkData);

        return checkData;

    } 
    catch (error) {

        console.log("something went wrong: ", error);

    };

};


