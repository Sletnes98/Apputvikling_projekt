// =========================================
//  Forside script.js – FULLSTENDIG FIL
// =========================================

const API_BASE_URL = "https://sukkergris.onrender.com";
const GROUP_KEY = "ABKGYB48";

let allCategories = []; // lagrer alle kategorier etter API-kall

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
        card.id = cat.id; // 👈 kategori-id (1–7)

        const title = document.createElement("h2");
        title.textContent = cat.category_name;

        const desc = document.createElement("p");
        desc.textContent = cat.description;

        card.appendChild(title);
        card.appendChild(desc);

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
        renderCategories(allCategories); // vis alle igjen
        return;
    }

    const filtered = allCategories.filter(cat =>
        cat.category_name.toLowerCase().startsWith(value)
    );

    renderCategories(filtered);
}

//------------------------------------------------------
// Klikk på kategori → gå til ProductList.html
//------------------------------------------------------
function setupCategoryClick() {
    let categoriesContainer = document.getElementById("categoriesContainer");
    categoriesContainer.addEventListener("click", seeCategoryProducts);
}

function seeCategoryProducts(event) {
    let categoryCard = event.target.closest(".category-card");

    if (!categoryCard) {
        console.log("Invalid click");
        return;
    }

    let categoryId = categoryCard.id;

    if (categoryId) {
        localStorage.setItem("selectedCategoryId", categoryId);

        // 👇 VIKTIG: Dette er stien som funker i prosjektet ditt
        window.location.href = "/Jonathan/Part_2/ProductList.html";
    }
}

//------------------------------------------------------
// Setup search + cart button
//------------------------------------------------------
function setupHomePageControls() {
    const searchInput = document.getElementById("search");
    const searchForm = document.getElementById("searchForm");
    const cartButton = document.getElementById("cartButton");

    // Live-filter
    searchInput.addEventListener("input", searchForCategory);

    // Klikk på søk
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        searchForCategory();
    });

    // Handlekurv-knapp
    cartButton.addEventListener("click", () => {
        window.location.href = "/Cart/cart.html"; // endre hvis handlekurv ligger et annet sted
    });
}

//------------------------------------------------------
// Init
//------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
    setupHomePageControls();
    setupCategoryClick();

    try {
        allCategories = await fetchCategories();
        renderCategories(allCategories);
    } catch (err) {
        console.error(err);
        document.getElementById("message").textContent =
            "Could not load categories from server.";
    }
});
