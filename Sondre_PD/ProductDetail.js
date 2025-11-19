// Group Key : ABKGYB48

let selectedID = localStorage.getItem("selectedProductId");
let productURL = `https://sukkergris.onrender.com/webshop/products?id=${selectedID}&key=ABKGYB48`;

//-------------------------------------------------------------------------------------------------------------
// Hent produktdata
//-------------------------------------------------------------------------------------------------------------

async function loadProduct() {
    try {
        const response = await fetch(productURL);
        const data = await response.json();
        console.log(data);
        showProduct(data[0]);
    } catch (error) {
        console.log("something went wrong:", error);
    }
}

loadProduct();

//-------------------------------------------------------------------------------------------------------------
// Vis produktinformasjon (template style)
//-------------------------------------------------------------------------------------------------------------

function showProduct(item) {

    const container = document.getElementById("productDetail");

    // Bildelogikk
    const imageUrl = item.static
        ? `https://sukkergris.onrender.com/images/GFTPOE21/large/${item.image}`
        : `https://sukkergris.onrender.com/images/ABKGYB48/large/${item.image}`;

    // Datoformat
    const formattedDate = item.expected_shipped
        ? new Date(item.expected_shipped).toLocaleDateString("no-NO", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
        : "";

    // Rating-stjerner
    const ratingStars = item.rating ? "⭐".repeat(Math.round(item.rating)) : "";

    // HTML som kompisen din ville skrevet – rent og enkelt
    container.innerHTML = `
        <h2>${item.name}</h2>

        <img src="${imageUrl}" alt="${item.name}">

        <p><strong>Kategori:</strong> ${item.category_name}</p>
        <p><strong>Pris:</strong> ${item.price} kr</p>
        <p><strong>Beskrivelse:</strong> ${item.description}</p>

        ${item.discount > 0 ? `<p>Rabatt: ${item.discount}%</p>` : ""}

        ${item.rating ? `<p><strong>Vurdering:</strong> ${ratingStars}</p>` : ""}

        <p><strong>Lagerstatus:</strong> 
            ${item.in_stock 
                ? `På lager (${item.stock} stk)` 
                : `Utsolgt – forventet levering: ${formattedDate}`
            }
        </p>

        <button id="buyBtn">Kjøp produkt</button>
        <button id="backBtn">Tilbake</button>
    `;

    //----------------------------------------------------------------------------------------
    // KJØP-KNAPP
    //----------------------------------------------------------------------------------------
    document.getElementById("buyBtn").addEventListener("click", () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push({ ...item, qty: 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Produkt lagt til i handlekurven!");
    });

    //----------------------------------------------------------------------------------------
    // TILBAKE-KNAPP
    //----------------------------------------------------------------------------------------
    document.getElementById("backBtn").addEventListener("click", () => {
        window.location.href = "../Jonathan/Part_2/ProductList.html";
    });
}

//-------------------------------------------------------------------------------------------------------------
// HEADER-KNAPPER
//-------------------------------------------------------------------------------------------------------------

document.getElementById("homepageBtn").addEventListener("click", () => {
    window.location.href = "../Sander/HomePage.html";
});

document.getElementById("cartBtn").addEventListener("click", () => {
    window.location.href = "../Sondre_SC/ShoppingCart.html";
});

//-------------------------------------------------------------------------------------------------------------
