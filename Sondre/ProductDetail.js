// Group Key : ABKGYB48

let selectedID = localStorage.getItem("selectedProductId");
let productURL = `https://sukkergris.onrender.com/webshop/products?id=${selectedID}&key=ABKGYB48`;
let productData;

//-------------------------------------------------------------------------------------------------------------
// Hent produktdata
//-------------------------------------------------------------------------------------------------------------

async function loadProduct() {

    try {
        let response = await fetch(productURL);
        productData = await response.json();

        console.log(productData);
        showProduct();

    } catch (error) {
        console.log("something went wrong: ", error);
    };

};

loadProduct();

//-------------------------------------------------------------------------------------------------------------
// Vis produktinformasjon
//-------------------------------------------------------------------------------------------------------------

function showProduct() {

    // API gir et array med ett produkt, så vi bruker første element
    let item = productData[0];

    const container = document.getElementById("productDetail");
    container.innerHTML = "";

    //---------------------------------------------------------------
    // Produktinfo-elementer
    //---------------------------------------------------------------

    let title = document.createElement("h2");
    title.innerHTML = item.name;

    let productImage = document.createElement("img"); 
    productImage.alt = item.name;

    if (item.static === true) {
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

    //---------------------------------------------------------------
    // Rabatt
    //---------------------------------------------------------------

    if (item.discount > 0) {
        let discount = document.createElement("p");
        discount.innerHTML = "💸 Rabatt: " + item.discount + "%";
        container.appendChild(discount);
    }

    //---------------------------------------------------------------
    // Rating (1–5 stjerner)
    //---------------------------------------------------------------

    if (item.rating) {
        let rating = document.createElement("p");
        let stars = Math.round(item.rating);
        rating.innerHTML = "<strong>Vurdering:</strong> " + "⭐".repeat(stars);
        container.appendChild(rating);
    }

    //---------------------------------------------------------------
    // Lagerstatus
    //---------------------------------------------------------------

    let stock = document.createElement("p");

    if (item.in_stock) {
        stock.innerHTML = "<strong>Lagerstatus:</strong> På lager (" + item.stock + " stk)";
    } else {
        const date = new Date(item.expected_shipped);
        const formatted = date.toLocaleDateString("no-NO", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        stock.innerHTML = "<strong>Lagerstatus:</strong> Utsolgt – forventet levering: " + formatted;
    }

    //---------------------------------------------------------------
    // Knapper nederst
    //---------------------------------------------------------------

    // Kjøp-knapp
    let buyBtn = document.createElement("button");
    buyBtn.innerText = "Kjøp produkt";
    buyBtn.addEventListener("click", function () {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Produkt lagt til i handlekurven!");
    });

    // Tilbake-knapp
    let backBtn = document.createElement("button");
    backBtn.innerText = "Tilbake";
    backBtn.addEventListener("click", function () {
        window.location.href = "../Jonathan/Part_2/ProductList.html";
    });

    //---------------------------------------------------------------
    // Legg alt inn i container
    //---------------------------------------------------------------

    container.appendChild(title);
    container.appendChild(productImage);
    container.appendChild(category);
    container.appendChild(price);
    container.appendChild(description);
    container.appendChild(stock);
    container.appendChild(buyBtn);
    container.appendChild(backBtn);
}

//-------------------------------------------------------------------------------------------------------------
// Navigasjonsknapper i header
//-------------------------------------------------------------------------------------------------------------

// Hjem (Sanders forside)
document.getElementById("homepageBtn").addEventListener("click", function () {
    window.location.href = "../Sander/HomePage.html";
});

// Handlekurv
document.getElementById("cartBtn").addEventListener("click", function () {
    window.location.href = "../Jonathan/ShoppingCart.html";
});

//-------------------------------------------------------------------------------------------------------------
