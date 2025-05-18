import { fetchProducts, fetchCategories } from "./api.js";
import { renderProducts, renderCategories } from "./productRenderer.js";
import {
  setupCountdown,
  setupSearch,
  setupCart,
  setupSorting,
  setupCategoryFilter,
} from "./utils.js";

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

async function initApp() {
  setupCountdown();
  setupSearch(handleSearch);
  setupCart();
  setupSorting(handleSort);

  try {
    const categories = await fetchCategories();
    if (!Array.isArray(categories)) {
      console.error("Categories is not an array:", categories);
      return;
    }
    state.categories = categories;
    renderCategories(categories, handleCategorySelect);

    const products = await fetchProducts();
    state.products = products;
    state.filteredProducts = [...products];

    renderProducts(
      state.filteredProducts.slice(0, state.productsPerPage),
      handleAddToCart
    );

    document
      .getElementById("load-more")
      .addEventListener("click", loadMoreProducts);

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

  document.querySelectorAll(".category-item").forEach((item) => {
    item.classList.toggle(
      "active",
      item.dataset.category === state.selectedCategory
    );
  });
}

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
      state.filteredProducts.sort((a, b) => a.id - b.id);
  }

  state.currentPage = 1;
  renderProducts(
    state.filteredProducts.slice(0, state.productsPerPage),
    handleAddToCart,
    true
  );
}

function loadMoreProducts() {
  state.currentPage++;
  const startIndex = (state.currentPage - 1) * state.productsPerPage;
  const endIndex = startIndex + state.productsPerPage;
  const nextProducts = state.filteredProducts.slice(startIndex, endIndex);

  if (nextProducts.length > 0) {
    renderProducts(nextProducts, handleAddToCart, false);
  }

  if (endIndex >= state.filteredProducts.length) {
    document.getElementById("load-more").style.display = "none";
  }
}

function handleAddToCart(product) {
  state.cartCount++;
  document.getElementById("cart-count").textContent = state.cartCount;

  const toast = document.getElementById("toast");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

document.addEventListener("DOMContentLoaded", initApp);
