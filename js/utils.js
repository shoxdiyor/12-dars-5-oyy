/**
 * Setup countdown timer for sale
 */
export function setupCountdown() {
  // Set countdown to 7 days from now
  const countdownDate = new Date();
  countdownDate.setDate(countdownDate.getDate() + 7);

  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    // Calculate time components
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update DOM
    daysElement.textContent = days.toString().padStart(2, "0");
    hoursElement.textContent = hours.toString().padStart(2, "0");
    minutesElement.textContent = minutes.toString().padStart(2, "0");
    secondsElement.textContent = seconds.toString().padStart(2, "0");

    // If countdown is finished
    if (distance < 0) {
      clearInterval(countdownInterval);
      daysElement.textContent = "00";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";
    }
  }

  // Update countdown immediately and then every second
  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);
}

/**
 * Setup search functionality
 * @param {Function} searchHandler - Function to handle search
 */
export function setupSearch(searchHandler) {
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");

  function handleSearch() {
    const query = searchInput.value.trim();
    searchHandler(query);
  }

  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  });

  searchBtn.addEventListener("click", handleSearch);
}

/**
 * Setup cart functionality
 */
export function setupCart() {
  const cartBtn = document.getElementById("cart-btn");

  cartBtn.addEventListener("click", () => {
    alert(
      "Cart functionality would be implemented here in a full application."
    );
  });
}

/**
 * Setup sorting functionality
 * @param {Function} sortHandler - Function to handle sorting
 */
export function setupSorting(sortHandler) {
  const sortSelect = document.getElementById("sort-products");

  sortSelect.addEventListener("change", () => {
    sortHandler(sortSelect.value);
  });
}

/**
 * Setup category filter
 * @param {Function} categoryHandler - Function to handle category filtering
 */
export function setupCategoryFilter(categoryHandler) {
  const categoryItems = document.querySelectorAll(".category-item");

  categoryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const category = item.dataset.category;
      categoryHandler(category);
    });
  });
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay) {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}
