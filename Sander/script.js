// script.js

const API_BASE_URL = "https://sukkergris.onrender.com";
const GROUP_KEY = "ABKGYB48";

//------------------------------------------------------
// Hent kategorier fra API
//------------------------------------------------------
async function fetchCategories() {
    const url = `${API_BASE_URL}/webshop/categories?key=${GROUP_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        // Dette gjør at vi kan håndtere feilen i init-funksjonen
        throw new Error("Feil ved henting av kategorier. Status: " + response.status);
    }

    // Forventet format: array med objekter
    const data = await response.json();
    return data;
}

//------------------------------------------------------
// Tegn kategorier i DOM
//------------------------------------------------------
function renderCategories(categories) {
    const container = document.getElementById("categoriesContainer");
    const messageEl = document.getElementById("message");

    container.innerHTML = "";
    messageEl.textContent = "";

    if (!Array.isArray(categories) || categories.length === 0) {
        messageEl.textContent = "Fant ingen kategorier.";
        return;
    }

    categories.forEach(cat => {
        const card = document.createElement("article");
        card.className = "category-card";

        const title = document.createElement("h2");
        title.textContent = cat.category_name;

        const desc = document.createElement("p");
        desc.textContent = cat.description;

        const link = document.createElement("a");
        // Multi-page: send videre til produktside for denne kategorien
        link.href = `products.html?categoryId=${encodeURIComponent(cat.id)}`;
        link.textContent = "Se produkter i denne kategorien";

        card.appendChild(title);
        card.appendChild(desc);
        card.appendChild(link);

        container.appendChild(card);
    });
}

//------------------------------------------------------
// Init – kjøres når siden er lastet
//------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
    const messageEl = document.getElementById("message");

    try {
        const categories = await fetchCategories();
        renderCategories(categories);
    } catch (error) {
        console.error(error);
        messageEl.textContent = "Kunne ikke hente kategorier fra serveren. Prøv igjen senere.";
    }
});
