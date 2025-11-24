const groupKey =  "ABKGYB48";

let selectedID = localStorage.getItem("selectedCategoryId");
let checkURL = `https://sukkergris.onrender.com/webshop/products?category=${selectedID}&key=${groupKey}`;
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

        let productDiv = document.createElement("div");
        productDiv.id = item.id;
        container.appendChild(productDiv);
    
        let searchedProductTitle = document.createElement("h1");
        searchedProductTitle.innerText = item.name;
        productDiv.appendChild(searchedProductTitle);
    
        let productPrice = document.createElement("p");
        productPrice.innerText = item.price + " kr";
        productDiv.appendChild(productPrice);
    
        let productThumb = document.createElement("img");
    
        if (item.static == true) {
            productThumb.src = `https://sukkergris.onrender.com/images/GFTPOE21/small/${item.thumb}`;
        } else {
            productThumb.src = `https://sukkergris.onrender.com/images/ABKGYB48/small/${item.thumb}`;
        }
        
        productDiv.appendChild(productThumb);

    };


};

//-------------------------------------------------------------------------------------------------------------

let search = document.getElementById("search");
search.addEventListener("input", searchForCatagory);

function searchForCatagory() {
    const searchValue = search.value.toLowerCase();

    const container = document.getElementById("container");
    container.innerHTML = "";

    const filteredSearch = checkData.filter(item =>
        item.name.toLowerCase().includes(searchValue)
    );

    if (filteredSearch.length === 0) {
    container.innerHTML = "<h1>Your search did not match any products</h1>";
    return;
    };

    for (let item of filteredSearch) {

        let productDiv = document.createElement("div");
        productDiv.id = item.id;
        container.appendChild(productDiv);
    
        let searchedProductTitle = document.createElement("h1");
        searchedProductTitle.innerText = item.name;
        productDiv.appendChild(searchedProductTitle);
    
        let productPrice = document.createElement("p");
        productPrice.innerText = item.price + " kr";
        productDiv.appendChild(productPrice);
    
        let productThumb = document.createElement("img");
    
        if (item.static == true) {
            productThumb.src = `https://sukkergris.onrender.com/images/GFTPOE21/small/${item.thumb}`;
        } else {
            productThumb.src = `https://sukkergris.onrender.com/images/ABKGYB48/small/${item.thumb}`;
        }
        
        productDiv.appendChild(productThumb);
    };

    };
    

//-------------------------------------------------------------------------------------------------------------

let getProductDetail = document.getElementById("container");
getProductDetail.addEventListener("click", seeProductDetail);

function seeProductDetail(event) {

    let productDiv = event.target.closest("div");
    console.log(productDiv.id);

    if (productDiv.id) {
        localStorage.setItem("selectedProductId", productDiv.id);
        window.location.href = "../../Sondre/ProductDetail.html";
    } else {
        console.log("Invalid click");
    }

};