import { loadData } from "./fetchProductData.js";


let checkData = await loadData();
createCatagoryList();

export async function createCatagoryList() {

    await checkData.forEach(product => {

        const container = document.getElementById("productContainer")
        let thumbSrc = product.static
            ? `https://sukkergris.onrender.com/images/GFTPOE21/small/${product.thumb}`
            : `https://sukkergris.onrender.com/images/ABKGYB48/small/${product.thumb}`;

        container.innerHTML +=  `

            <div id="${product.id}">
                <h1>${product.name} </h1>
                <p>${product.price} kr</p>
                <img src="${thumbSrc}"/>
            </div>
                                `
    });

    checkData.forEach(product => {

        let getProductDetail = document.getElementById(`${product.id}`);
    
        getProductDetail.addEventListener("click", event => {
        
            if (product.id) {
                localStorage.setItem("selectedProductId", product.id);
                window.location.href = "../../../Sondre_PD/productDetail.html";
            } else {
                console.log("Invalid click");
            }
    
        });
        
    });
};

//------------------------------------------------------------------------------------------------------------


const searchInput = document.getElementById("search");
const container = document.getElementById("productContainer");

searchInput.addEventListener("input", (event) => {
    const searchValue = event.target.value.toLowerCase();

    const filteredProducts = checkData.filter(item =>
        item.name.toLowerCase().includes(searchValue)
    );

    container.innerHTML = "";

    filteredProducts.forEach(product => {
        const thumbSrc = product.static

            ? `https://sukkergris.onrender.com/images/GFTPOE21/small/${product.thumb}`
            : `https://sukkergris.onrender.com/images/ABKGYB48/small/${product.thumb}`;

        container.innerHTML += `
            <div id="${product.id}">
                <h1>${product.name}</h1>
                <p>${product.price} kr</p>
                <img src="${thumbSrc}" />
            </div>
        `;
    });

    if (filteredProducts.length === 0) {
        container.innerHTML = "<p>Ingen produkter matcher søket</p>";
    }
});

//------------------------------------------------------------------------------------------------------------

const homeButton = document.getElementById("home");
homeButton.addEventListener("click", event => {

    window.location.href = "../../../Sander/HomePage.html";

});

//------------------------------------------------------------------------------------------------------------

    const userThumb = document.getElementById("userThumb");

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    
    console.log(userInfo.logindata);

    userThumb.src = `https://sukkergris.onrender.com/images/ABKGYB48/users/${userInfo.logindata.thumb}`








