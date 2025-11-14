
const API_BASE_URL = "https://sukkergris.onrender.com";
const GROUP_KEY = "ABKGYB48";

let allCategories = []; // Lagrer alle kategorier etter API-kall

//------------------------------------------------------
// Hent kategorier fra API
//------------------------------------------------------
async function fetchCategories() {
    const url = `${API_BASE_URL}/webshop/categories?key=${GROUP_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Error fetching categories. Status: " + response.status);
    }

    return await response.json();
}

//------------------------------------------------------
// Tegn kategorier på siden
//------------------------------------------------------
function renderCategories(categoryList) {
    const container = document.getElementById("categoriesContainer");
    const messageEl = document.getElementById("message");

    container.innerHTML = "";
    messageEl.textContent = "";

    if (!Array.isArray(categoryList) || categoryList.length === 0) {
        messageEl.textContent = "No categories found.";
        return;
    }

    for (let cat of categoryList) {
        const card = document.createElement("article");
        card.className = "category-card";

        const title = document.createElement("h2");
        title.textContent = cat.category_name;

        const desc = document.createElement("p");
        desc.textContent = cat.description;

        const link = document.createElement("a");
        link.href = `products.html?categoryId=${encodeURIComponent(cat.id)}`;
        link.textContent = "Show products in this category";

        card.appendChild(title);
        card.appendChild(desc);
        card.appendChild(link);

        container.appendChild(card);
    }
}

//------------------------------------------------------
// Filter kategorier basert på søk
//------------------------------------------------------
function searchForCategory() {
    const searchInput = document.getElementById("search");
    const value = searchInput.value.toLowerCase();

    if (value === "") {
        // tomt søk → vis alle kategorier igjen
        renderCategories(allCategories);
        return;
    }

    const filtered = allCategories.filter(cat =>
        cat.category_name.toLowerCase().includes(value)
    );

    renderCategories(filtered);
}

//------------------------------------------------------
// Koble søk + handlekurv-knapp
//------------------------------------------------------
function setupHomePageControls() {
    const searchInput = document.getElementById("search");
    const searchForm = document.getElementById("searchForm");
    const cartButton = document.getElementById("cartButton");

    // Søket filtrerer mens du skriver
    searchInput.addEventListener("input", searchForCategory);

    // Søket filtrerer når du trykker søkeknappen
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        searchForCategory();
    });

    // Handlekurv (egen side)
    cartButton.addEventListener("click", () => {
        window.location.href = "cart.html";
    });
}

//------------------------------------------------------
// Init – kjører når siden lastes
//------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
    setupHomePageControls();

    try {
        allCategories = await fetchCategories(); // lagre alle kategorier
        renderCategories(allCategories); // vis dem
    } catch (err) {
        console.error(err);
        document.getElementById("message").textContent =
            "Could not load categories from server.";
    }
});
