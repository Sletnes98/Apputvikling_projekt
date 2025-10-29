// Group Key : ABKGYB48

let testID = 1;
let checkURL = `https://sukkergris.onrender.com/webshop/products?category=${testID}&key=ABKGYB48`;
let checkData;

async function loadData() {

    try {
        let response = await fetch(checkURL);
        checkData = await response.json();

        console.log(checkData);
        createCatagory();

    } 
    
    catch (error) {
        console.log("something went wrong: ", error);
    };

};

loadData();

//-------------------------------------------------------------------------------------------------------------

function createCatagory() {

    for (let item of checkData) {

        let createList = document.createElement("h1");
        document.getElementById("container").appendChild(createList);
        console.log(item.category_name);
        createList.innerHTML = item.name + " " + item.id;

    };


};

//-------------------------------------------------------------------------------------------------------------

let buttonSearch = document.getElementById("buttonSearch");
buttonSearch.addEventListener("click", searchForCatagory);

let search = document.getElementById("search");
search.addEventListener("input", searchForCatagory);

function searchForCatagory() {

    console.log(search.value);

};