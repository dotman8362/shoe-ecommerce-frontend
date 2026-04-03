// src/api/products.js
const API_BASE = 'http://localhost:5000/api'; // Change to your actual backend URL

// Fetch single product by ID
export async function fetchProductById(id) {
  const response = await fetch(`${API_BASE}/products/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    if (response.status === 404) {
      throw new Error(error.message || 'Product not found');
    }
    if (response.status === 400) {
      throw new Error('Invalid product ID');
    }
    throw new Error(error.message || 'Failed to fetch product');
  }
  
  return response.json();
}

// Fetch all products
export async function fetchAllProducts() {
  const response = await fetch(`${API_BASE}/products`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return response.json();
}