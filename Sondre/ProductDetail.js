// Group Key : ABKGYB48

let selectedID = localStorage.getItem("selectedProductId");
let productURL = `https://sukkergris.onrender.com/webshop/products?id=${selectedID}&key=ABKGYB48`;
let productData;

//-------------------------------------------------------------------------------------------------------------

async function loadProduct() {

    try {
        let response = await fetch(productURL);
        productData = await response.json();

        console.log(productData);
        showProduct();

    } 
    
    catch (error) {
        console.log("something went wrong: ", error);
    };

};

loadProduct();

//-------------------------------------------------------------------------------------------------------------

function showProduct() {

    // API gir et array med ett produkt, så vi bruker første element
    let item = productData[0];

    const container = document.getElementById("productDetail");
    container.innerHTML = "";

    // Lag HTML-elementer for produktinformasjon
    let title = document.createElement("h2");
    title.innerHTML = item.name;

    let productImage = document.createElement("img"); 
    productImage.alt = item.name;


     if (item.static == true) {
            productImage.src = `https://sukkergris.onrender.com/images/GFTPOE21/large/${item.image}`;
        } else {
            productImage.src = `https://sukkergris.onrender.com/images/ABKGYB48/large/${item.image}`;
        }

    let category = document.createElement("p");
    category.innerHTML = "<strong>Kategori:</strong> " + item.category_name;

    let price = document.createElement("p");
    price.innerHTML = "<strong>Pris:</strong> " + item.price + " kr";

    let description = document.createElement("p");
    description.innerHTML = "<strong>Beskrivelse:</strong> " + item.description;

    // Rabatt
    let discount = document.createElement("p");
    if (item.discount > 0) {
        discount.innerHTML = "💸 Rabatt: " + item.discount + "%";
    }

    // Lagerstatus
    let stock = document.createElement("p");
    if (item.in_stock) {
        stock.innerHTML = "<strong>Lagerstatus:</strong> På lager";
    } else {
        stock.innerHTML = "<strong>Lagerstatus:</strong> Utsolgt";
    }

    // Kjøp-knapp
    let buyBtn = document.createElement("button");
    buyBtn.innerText = "🛒 Kjøp produkt";
    buyBtn.addEventListener("click", function () {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Produkt lagt til i handlekurven!");
    });

    // Legg til alt i containeren
    container.appendChild(title);
    container.appendChild(productImage);
    container.appendChild(category);
    container.appendChild(price);
    container.appendChild(description);
    if (item.discount > 0) container.appendChild(discount);
    container.appendChild(stock);
    container.appendChild(buyBtn);
}

//-------------------------------------------------------------------------------------------------------------

document.getElementById("homeBtn").addEventListener("click", function () {
    window.location.href = "/../Jonathan/ProductList.html";
});

document.getElementById("cartBtn").addEventListener("click", function () {
    window.location.href = "../Jonathan/ShoppingCart.html";
});

//-------------------------------------------------------------------------------------------------------------
