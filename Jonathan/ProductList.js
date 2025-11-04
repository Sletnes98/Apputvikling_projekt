// Group Key : ABKGYB48

let testID = 3;
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
        createList.innerHTML = item.name //+ " " + item.id;


    };


};

//-------------------------------------------------------------------------------------------------------------

let search = document.getElementById("search");
search.addEventListener("input", searchForCatagory);

function searchForCatagory() {
    const searchValue = search.value.toLowerCase();

    const container = document.getElementById("container");
    container.innerHTML = "";

    const filtered = checkData.filter(item =>
        item.name.toLowerCase().includes(searchValue)
    );

    if (filtered.length === 0) {
    container.innerHTML = "<h1>Your search did not match any products</h1>";
    return;
    };

    for (let item of filtered) {
        const h1 = document.createElement("h1");
        h1.innerText = item.name //+ " " + item.id;
        container.appendChild(h1);
    }
}
