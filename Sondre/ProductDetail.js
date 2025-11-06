// ProductDetail.js
// Gruppe: Sukkergris, Key = ABKGYB48
// Denne filen viser detaljer om ett produkt

document.addEventListener("DOMContentLoaded", function () {

  // 1️ Finn hvor produktinformasjonen skal vises
  const container = document.getElementById("productDetail");

  // 2️ Hent produkt-ID fra localStorage (lagret fra ProductList)
  const productId = localStorage.getItem("selectedProductId");

  if (!productId) {
    container.innerHTML = "<p>Fant ikke produktet.</p>";
    return;
  }

  // 3️ Lag URL for å hente produktinfo fra Sukkergris-serveren
  const url = "https://sukkergris.onrender.com/webshop/products?id=" + productId + "&key=ABKGYB48";

  // 4️ Hent produktdata fra serveren
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Serveren returnerer et array, selv om vi bare henter ett produkt
      const product = data[0];

      // 5️ Lag HTML som viser produktet
      let html = "";
      html += "<h2>" + product.name + "</h2>";
      html += "<img src='" + product.picture_url + "' alt='" + product.name + "' style='max-width:200px;'>";
      html += "<p><strong>Kategori:</strong> " + product.category_name + "</p>";
      html += "<p><strong>Pris:</strong> " + product.price + " kr</p>";
      html += "<p><strong>Beskrivelse:</strong> " + product.description + "</p>";

      if (product.discount > 0) {
        html += "<p>💸 Rabatt: " + product.discount + "%</p>";
      }

      if (product.in_stock) {
        html += "<p><strong>Lagerstatus:</strong> På lager</p>";
      } else {
        html += "<p><strong>Lagerstatus:</strong> Utsolgt</p>";
      }

      html += "<button id='buyBtn'>🛒 Kjøp produkt</button>";

      container.innerHTML = html;

      // 6️ Når man trykker "Kjøp produkt"
      const buyBtn = document.getElementById("buyBtn");
      buyBtn.addEventListener("click", function () {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Produkt lagt til i handlekurven!");
      });
    })
    .catch(function (error) {
      console.log("Feil ved henting av produkt:", error);
      container.innerHTML = "<p>Kunne ikke laste produktdetaljer.</p>";
    });

  // 7️ Navigasjonsknapper
  document.getElementById("homeBtn").addEventListener("click", function () {
    window.location.href = "../Jonathan/ProductList.html";
  });

  document.getElementById("cartBtn").addEventListener("click", function () {
    window.location.href = "../Jonathan/ShoppingCart.html";
  });
});
