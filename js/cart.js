let cart = [];

function loadCart() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
      updateCartDisplay();
      updateCartCount();
    } catch (e) {
      console.error("Error loading cart from localStorage:", e);
      cart = [];
    }
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productId) {
  const product = findProductById(productId);

  if (!product) {
    console.error(`Product with ID ${productId} not found`);
    return;
  }

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  saveCart();
  updateCartDisplay();
  updateCartCount();
  showToast(`${product.name} added to cart`);
}

function removeFromCart(productId) {
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex !== -1) {
    const removedItem = cart[itemIndex];
    cart.splice(itemIndex, 1);
    saveCart();
    updateCartDisplay();
    updateCartCount();
    showToast(`${removedItem.name} removed from cart`);
  }
}

function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);

  if (item) {
    item.quantity += change;

    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    saveCart();
    updateCartDisplay();
    updateCartCount();
  }
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  cartCount.textContent = totalItems;

  if (totalItems > 0) {
    cartCount.classList.add("pulse");
    setTimeout(() => {
      cartCount.classList.remove("pulse");
    }, 400);
  }
}

function calculateCartTotals() {
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  return { subtotal, tax, total };
}

function updateCartDisplay() {
  const cartItems = document.getElementById("cart-items");
  const cartSubtotal = document.getElementById("cart-subtotal");
  const cartTax = document.getElementById("cart-tax");
  const cartTotal = document.getElementById("cart-total");

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <p>Your cart is empty</p>
      </div>
    `;
  } else {
    cart.forEach((item) => {
      const cartItemElement = document.createElement("div");
      cartItemElement.classList.add("cart-item");

      cartItemElement.innerHTML = `
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.name}</h4>
          <div class="cart-item-price">$${(item.price * item.quantity).toFixed(
            2
          )}</div>
          <div class="cart-item-actions">
            <div class="quantity-control">
              <button class="quantity-btn decrease" data-id="${
                item.id
              }">-</button>
              <span class="quantity-display">${item.quantity}</span>
              <button class="quantity-btn increase" data-id="${
                item.id
              }">+</button>
            </div>
            <button class="remove-btn" data-id="${item.id}">
              <i class="fas fa-trash-alt"></i> Remove
            </button>
          </div>
        </div>
      `;

      cartItems.appendChild(cartItemElement);
    });

    document.querySelectorAll(".quantity-btn.decrease").forEach((button) => {
      button.addEventListener("click", () => {
        const id = parseInt(button.getAttribute("data-id"));
        updateQuantity(id, -1);
      });
    });

    document.querySelectorAll(".quantity-btn.increase").forEach((button) => {
      button.addEventListener("click", () => {
        const id = parseInt(button.getAttribute("data-id"));
        updateQuantity(id, 1);
      });
    });

    document.querySelectorAll(".remove-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const id = parseInt(button.getAttribute("data-id"));
        removeFromCart(id);
      });
    });
  }

  const { subtotal, tax, total } = calculateCartTotals();
  cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  cartTax.textContent = `$${tax.toFixed(2)}`;
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

function showToast(message) {
  const existingToast = document.querySelector(".toast");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

function checkout() {
  if (cart.length === 0) {
    showToast("Your cart is empty");
    return;
  }

  showToast("Order placed successfully!");

  cart = [];
  saveCart();
  updateCartDisplay();
  updateCartCount();

  document.getElementById("cart-sidebar").classList.remove("active");
  document.getElementById("cart-overlay").classList.remove("active");
}

document.addEventListener("DOMContentLoaded", () => {
  loadCart();

  const checkoutBtn = document.getElementById("checkout-btn");
  checkoutBtn.addEventListener("click", checkout);
});
