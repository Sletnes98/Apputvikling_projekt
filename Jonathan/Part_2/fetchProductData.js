const groupKey =  "ABKGYB48";

let testID = 3;
let selectedID = localStorage.getItem("selectedCategoryId");
let checkURL = `https://sukkergris.onrender.com/webshop/products?category=${selectedID}&key=${groupKey}`;
let checkData;

export async function loadData() {

    try {
        let response = await fetch(checkURL);
        checkData = await response.json();

        return checkData;

    } 
    catch (error) {

        console.log("something went wrong: ", error);

    };

};

