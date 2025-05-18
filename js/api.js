const API_BASE_URL = "https://dummyjson.com";
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/products`;
const CATEGORIES_ENDPOINT = `${API_BASE_URL}/products/categories`;

/**
 * Fetch all products from the API
 * @returns {Promise<Array>} Array of products
 */
export async function fetchProducts(limit = 100) {
  try {
    const response = await fetch(`${PRODUCTS_ENDPOINT}?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Fetch products by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Array of products
 */
export async function fetchProductsByCategory(category) {
  try {
    const response = await fetch(`${PRODUCTS_ENDPOINT}/category/${category}`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
}

/**
 * Fetch all categories from the API
 * @returns {Promise<Array>} Array of category names
 */
export async function fetchCategories() {
  try {
    const response = await fetch(CATEGORIES_ENDPOINT);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Search products by query
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of products
 */
export async function searchProducts(query) {
  try {
    const response = await fetch(
      `${PRODUCTS_ENDPOINT}/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error(`Error searching products with query ${query}:`, error);
    return [];
  }
}
