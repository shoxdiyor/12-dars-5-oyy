/**
 * Render product cards to the DOM
 * @param {Array} products - Array of product objects
 * @param {Function} addToCartHandler - Function to handle add to cart click
 * @param {boolean} clearContainer - Whether to clear the container before rendering
 */
export function renderProducts(
  products,
  addToCartHandler,
  clearContainer = false
) {
  const productsGrid = document.getElementById("products-grid");

  if (clearContainer) {
    productsGrid.innerHTML = "";
  }

  if (products.length === 0) {
    productsGrid.innerHTML = `
        <div class="no-products">
          <p>No products found. Try a different search or category.</p>
        </div>
      `;
    return;
  }

  products.forEach((product) => {
    const discountedPrice = (
      product.price *
      (1 - product.discountPercentage / 100)
    ).toFixed(2);
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.setAttribute("data-id", product.id);

    const rating = Math.round(product.rating * 2) / 2; // Round to nearest 0.5
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let starsHTML = "";
    for (let i = 0; i < fullStars; i++) {
      starsHTML +=
        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    }
    if (halfStar) {
      starsHTML +=
        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1 3-6.1v15.6z" /><path d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1 3-6.1" fill="none" /></svg>';
    }
    for (let i = 0; i < emptyStars; i++) {
      starsHTML +=
        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    }

    productCard.innerHTML = `
        <div class="product-image">
          <img src="${product.thumbnail}" alt="${product.title}" loading="lazy">
        </div>
        ${
          product.discountPercentage > 0
            ? `<div class="product-discount-badge">-${Math.round(
                product.discountPercentage
              )}%</div>`
            : ""
        }
        <div class="product-details">
          <div class="product-category">${product.category}</div>
          <h3 class="product-title">${product.title}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-rating">
            <div class="stars">${starsHTML}</div>
            <span class="rating-text">(${product.rating})</span>
          </div>
          <div class="product-price-row">
            <div class="product-price">
              <span class="current-price">$${discountedPrice}</span>
              ${
                product.discountPercentage > 0
                  ? `<span class="original-price">$${product.price}</span>`
                  : ""
              }
            </div>
            <button class="add-to-cart" aria-label="Add to cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      `;

    productCard.querySelector(".add-to-cart").addEventListener("click", (e) => {
      e.preventDefault();
      addToCartHandler(product);
    });

    productsGrid.appendChild(productCard);
  });
}

/**
 * Render category items to the DOM
 * @param {Array} categories - Array of category names
 * @param {Function} categorySelectHandler - Function to handle category selection
 */
export function renderCategories(categories, categorySelectHandler) {
  const categoriesList = document.getElementById("categories-list");
  categoriesList.innerHTML = "";

  categories.forEach((category) => {
    const categoryItem = document.createElement("div");
    categoryItem.className = "category-item";
    categoryItem.setAttribute("data-category", category);

    const formattedCategory = String(category)
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    categoryItem.innerHTML = `
        <div class="category-content">
          <span class="category-name">${formattedCategory}</span>
        </div>
      `;

    categoryItem.addEventListener("click", () => {
      categorySelectHandler(category);
    });

    categoriesList.appendChild(categoryItem);
  });
}
