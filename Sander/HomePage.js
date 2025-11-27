// =========================================
//  Forside script.js – FULLSTENDIG FIL
// =========================================

const API_BASE_URL = "https://sukkergris.onrender.com";
const GROUP_KEY = "ABKGYB48";

let allCategories = []; // lagrer alle kategorier etter API-kall

// ------------------------------------------------------------
// Hent kategorier fra API
// ------------------------------------------------------------
async function fetchCategories() {
    const url = `${API_BASE_URL}/webshop/categories?key=${GROUP_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Error fetching categories. Status: " + response.status);
    }

    return await response.json();
}

// ------------------------------------------------------------
// Tegn kategorier på siden
// ------------------------------------------------------------
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
        card.id = cat.id; // kategori-id (1–7)

        const title = document.createElement("h2");
        title.textContent = cat.category_name;

        const desc = document.createElement("p");
        desc.textContent = cat.description;

        card.appendChild(title);
        card.appendChild(desc);

        container.appendChild(card);
    }
}

// ------------------------------------------------------------
// Filter kategorier basert på søk
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// Klikk på kategori → gå til ProductList.html
// ------------------------------------------------------------
function setupCategoryClick() {
    let categoriesContainer = document.getElementById("categoriesContainer");
    if (!categoriesContainer) return;

    categoriesContainer.addEventListener("click", seeCategoryProducts);
}

// ------------------------------------------------------------
function seeCategoryProducts(event) {
    let categoryCard = event.target.closest(".category-card");

    if (!categoryCard) {
        console.log("Invalid click");
        return;
    }

    let categoryId = categoryCard.id;

    if (categoryId) {
        localStorage.setItem("selectedCategoryId", categoryId);

        // Sti til produktliste (tilpasset prosjektstrukturen deres)
        window.location.href = "../Jonathan/Part_2/ProductList.html";
    }
}

// ------------------------------------------------------------
// Search-kontroller (bare søk, ikke knapper)
// ------------------------------------------------------------
function setupHomePageControls() {
    const searchInput = document.getElementById("search");
    const searchForm = document.getElementById("searchForm");

    if (searchInput) {
        // Live-filter
        searchInput.addEventListener("input", searchForCategory);
    }

    if (searchForm) {
        // Klikk på søk-knapp / Enter
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            searchForCategory();
        });
    }
}

// ------------------------------------------------------------
// Navigasjonsknapper (home-headeren)
// ------------------------------------------------------------
function setupNavigation() {
    const forumBtn = document.getElementById("forumButton");
    const cartBtn = document.getElementById("cartButton");
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");

    if (forumBtn) {
        forumBtn.addEventListener("click", () => {
            window.location.href = "../Sander/MessageBoard.html";
        });
    }

    if (cartBtn) {
        cartBtn.addEventListener("click", () => {
            window.location.href = "../Sondre_SC/ShoppingCart.html";
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            window.location.href = "../Andreas/Login/loginUser.html";
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener("click", () => {
            window.location.href = "../Jonathan/Part_4/createUser.html";
        });
    }
}

// ------------------------------------------------------------
// USER LOGIN STATUS + THUMBNAIL
// ------------------------------------------------------------
function setupUserThumbnail() {
    const thumb = document.getElementById("userThumb");
    if (!thumb) return; // hvis siden ikke har thumb

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    // Ikke innlogget → vis login-ikon
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

// ------------------------------------------------------------
// Init – kjører når siden er lastet
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
    setupNavigation();
    setupHomePageControls();
    setupCategoryClick();
    setupUserThumbnail();

    try {
        allCategories = await fetchCategories();
        renderCategories(allCategories);
    } catch (err) {
        console.error(err);
        const msgEl = document.getElementById("message");
        if (msgEl) {
            msgEl.textContent = "Could not load categories from server.";
        }
    }
});
