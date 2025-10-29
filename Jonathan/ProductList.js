// Group Key : ABKGYB48

let checkURL = "https://sukkergris.onrender.com/webshop/products?category=5&key=ABKGYB48";
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

function searchForCatagory() {

    let checkSearch = document.getElementById("container");

    if (checkSearch == `${search.value}`){

        console.log("Den inneholdte det!");

    }

    else {

        console.log("Den inneholdte ikke det!");

    }



};