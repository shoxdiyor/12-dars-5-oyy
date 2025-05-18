let cart = [];

async function addToCart(productId, quantity = 1) {
  try {
    const response = await fetch(`https://dummyjson.com/products/${productId}`);
    const product = await response.json();

    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: quantity,
      });
    }

    console.log(`${product.title} добавлен в корзину.`);
  } catch (error) {
    console.error("Ошибка при добавлении товара:", error);
  }
}

function getCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function showCart() {
  console.log("🛒 Корзина:");
  cart.forEach((item) => {
    console.log(`${item.title} — ${item.quantity} x $${item.price}`);
  });
  console.log(`Итоговая сумма: $${getCartTotal()}`);
}
