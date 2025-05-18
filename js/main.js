import { fetchProducts, fetchCategories } from "./api.js";
import { renderProducts, renderCategories } from "./productRenderer.js";
import {
  setupCountdown,
  setupSearch,
  setupCart,
  setupSorting,
  setupCategoryFilter,
} from "./utils.js";

// Global state
let state = {
  products: [],
  filteredProducts: [],
  categories: [],
  selectedCategory: null,
  cartCount: 0,
  currentPage: 1,
  productsPerPage: 8,
  sortOption: "default",
};

// Initialize the application
async function initApp() {
  // Setup UI elements
  setupCountdown();
  setupSearch(handleSearch);
  setupCart();
  setupSorting(handleSort);

  try {
    // Fetch categories
    const categories = await fetchCategories();
    if (!Array.isArray(categories)) {
      console.error("Categories is not an array:", categories);
      return;
    }
    state.categories = categories;
    renderCategories(categories, handleCategorySelect);

    // Fetch products
    const products = await fetchProducts();
    state.products = products;
    state.filteredProducts = [...products];

    // Render initial products
    renderProducts(
      state.filteredProducts.slice(0, state.productsPerPage),
      handleAddToCart
    );

    // Setup event listeners
    document
      .getElementById("load-more")
      .addEventListener("click", loadMoreProducts);

    // Remove skeletons
    document.querySelectorAll(".product-skeleton").forEach((skeleton) => {
      skeleton.remove();
    });
    document.querySelectorAll(".category-skeleton").forEach((skeleton) => {
      skeleton.remove();
    });
  } catch (error) {
    console.error("Error initializing app:", error);
  }
}

// Handle search
function handleSearch(query) {
  if (!query) {
    state.filteredProducts = [...state.products];
  } else {
    query = query.toLowerCase();
    state.filteredProducts = state.products.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
  }

  state.currentPage = 1;
  renderProducts(
    state.filteredProducts.slice(0, state.productsPerPage),
    handleAddToCart,
    true
  );
}

// Handle category selection
function handleCategorySelect(category) {
  state.selectedCategory =
    category === state.selectedCategory ? null : category;

  if (!state.selectedCategory) {
    state.filteredProducts = [...state.products];
  } else {
    state.filteredProducts = state.products.filter(
      (product) => product.category === state.selectedCategory
    );
  }

  state.currentPage = 1;
  renderProducts(
    state.filteredProducts.slice(0, state.productsPerPage),
    handleAddToCart,
    true
  );

  // Update active category
  document.querySelectorAll(".category-item").forEach((item) => {
    item.classList.toggle(
      "active",
      item.dataset.category === state.selectedCategory
    );
  });
}

// Handle sorting
function handleSort(option) {
  state.sortOption = option;

  switch (option) {
    case "price-asc":
      state.filteredProducts.sort(
        (a, b) =>
          a.price * (1 - a.discountPercentage / 100) -
          b.price * (1 - b.discountPercentage / 100)
      );
      break;
    case "price-desc":
      state.filteredProducts.sort(
        (a, b) =>
          b.price * (1 - b.discountPercentage / 100) -
          a.price * (1 - a.discountPercentage / 100)
      );
      break;
    case "rating":
      state.filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    default:
      // Default sorting (by id)
      state.filteredProducts.sort((a, b) => a.id - b.id);
  }

  state.currentPage = 1;
  renderProducts(
    state.filteredProducts.slice(0, state.productsPerPage),
    handleAddToCart,
    true
  );
}

// Load more products
function loadMoreProducts() {
  state.currentPage++;
  const startIndex = (state.currentPage - 1) * state.productsPerPage;
  const endIndex = startIndex + state.productsPerPage;
  const nextProducts = state.filteredProducts.slice(startIndex, endIndex);

  if (nextProducts.length > 0) {
    renderProducts(nextProducts, handleAddToCart, false);
  }

  // Hide "Load More" button if all products are loaded
  if (endIndex >= state.filteredProducts.length) {
    document.getElementById("load-more").style.display = "none";
  }
}

// Handle add to cart
function handleAddToCart(product) {
  state.cartCount++;
  document.getElementById("cart-count").textContent = state.cartCount;

  // Show toast notification
  const toast = document.getElementById("toast");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Initialize the app when the DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);
