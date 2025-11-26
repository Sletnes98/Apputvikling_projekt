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
        <button class="cartBtn">Handlekurv</button>
        <button class="backBtn">Tilbake</button>
    `;
    //----------------------------------------------------------------------------------------
    // CART-KNAPP
    //----------------------------------------------------------------------------------------
    document.querySelectorAll(".cartBtn").forEach(btn => {
        btn.addEventListener("click", () => {
        window.location.href = "../Sondre_SC/ShoppingCart.html";
    });
});


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
    document.querySelectorAll(".backBtn").forEach(btn => {
        btn.addEventListener("click", () => {
        window.location.href = "../Jonathan/Part_2/ProductList.html";
     });
});


}

//-------------------------------------------------------------------------------------------------------------
// HEADER-KNAPPER
//-------------------------------------------------------------------------------------------------------------

document.getElementById("homepageBtn").addEventListener("click", () => {
    window.location.href = "../Sander/HomePage.html";
});

//-------------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------
// USER LOGIN STATUS + THUMBNAIL
// ------------------------------------------------------------
function setupUserThumbnail() {
    const thumb = document.getElementById("userThumb");
    if (!thumb) return; // hvis siden ikke har thumb

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    //  Ikke innlogget → vis login-ikon
    if (!userInfo || !userInfo.logindata) {
        thumb.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png"; // login ikon
        thumb.style.cursor = "pointer";

        thumb.addEventListener("click", () => {
            window.location.href = "../Andreas/Login/loginUser.html";
        });

        return;
    }

    // Innlogget → vis profilbilde
    const imageURL =
        `https://sukkergris.onrender.com/images/ABKGYB48/users/${userInfo.logindata.thumb}`;

    thumb.src = imageURL;
    thumb.style.cursor = "pointer";

    thumb.addEventListener("click", () => {
        window.location.href = "../../Jonathan/Task_16/editUserInfo.html";
    });
}

// Kjør funksjonen når siden laster  
document.addEventListener("DOMContentLoaded", setupUserThumbnail);
