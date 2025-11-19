const data = JSON.parse(localStorage.getItem("lastOrder"));

const infoContainer = document.getElementById("orderInfo");
const productContainer = document.getElementById("orderProducts");

if (!data) {
  infoContainer.innerHTML = "<p>Fant ingen ordre.</p>";
} else {
  const customer = data.customer;
  const products = data.orderlines;

  infoContainer.innerHTML = `
    <h3>Ordrebekreftelse</h3>

    <p><strong>Ordrenummer:</strong> ${data.order_id}</p>

    <h4>Kundeinformasjon</h4>
    <p><strong>Navn:</strong> ${customer.customer_name}</p>
    <p><strong>Telefon:</strong> ${customer.phone ?? "Ikke oppgitt"}</p>
    <p><strong>E-post:</strong> ${customer.email}</p>
    <p><strong>Adresse:</strong> ${customer.street}, ${customer.zipcode} ${customer.city}, ${customer.country}</p>

    <h4>Frakt</h4>
    <p><strong>Metode:</strong> ${data.shipping_name}</p>
    <p><strong>Estimert levering:</strong> ${new Date(data.expected_shipped).toLocaleDateString("no-NO")}</p>

    <h4>Produkter:</h4>
  `;

  // Produkter
  productContainer.innerHTML = `
    <ul>
      ${products.map(p => `
        <li>
          <strong>Produkt ID:</strong> ${p.product_id}<br>
          <strong>Navn:</strong> ${p.product_name}<br>
          <strong>Antall:</strong> ${p.qty}<br>
          <strong>Pris per:</strong> ${p.price} kr<br>
          <strong>Delsum:</strong> ${(p.price * p.qty).toFixed(2)} kr
        </li>
        <br>
      `).join("")}
    </ul>

    <h3>Totalpris: ${data.total} kr</h3>
  `;
}

// HJEM-KNAPP
document.getElementById("homepageBtn").addEventListener("click", () => {
  window.location.href = "../Sander/HomePage.html";
});
