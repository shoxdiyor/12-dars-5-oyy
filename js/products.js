let products = [];

async function fetchProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();
    products = data.products.map((product) => ({
      id: product.id,
      name: product.title,
      price: product.price,
      description: product.description,
      image: product.thumbnail,
      category: product.category,
    }));
    displayProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function displayProducts(productsToShow = products) {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "";

  productsToShow.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("product-card");
    productElement.dataset.category = product.category;

    productElement.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <div class="product-actions">
          <button class="add-to-cart" data-id="${product.id}">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>
    `;

    productsContainer.appendChild(productElement);
  });

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = parseInt(button.getAttribute("data-id"));
      addToCart(productId);
      button.classList.add("pulse");
      setTimeout(() => {
        button.classList.remove("pulse");
      }, 400);
    });
  });
}

function filterProducts(category) {
  let filteredProducts;

  if (category === "all") {
    filteredProducts = products;
  } else {
    filteredProducts = products.filter(
      (product) => product.category === category
    );
  }

  displayProducts(filteredProducts);
}

function findProductById(id) {
  return products.find((product) => product.id === id);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  setupFilterButtons();
});
