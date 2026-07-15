import API from "./authService";

// ===============================
// Add Product to Cart
// ===============================
export const addToCart = async (cartData) => {
  const response = await API.post("/cart/add", cartData);
  return response.data;
};

// ===============================
// Get My Cart
// ===============================
export const getCart = async () => {
  const response = await API.get("/cart");
  return response.data;
};

// ===============================
// Update Cart Item Quantity
// ===============================
export const updateCartItem = async (cartData) => {
  const response = await API.put("/cart/update", cartData);
  return response.data;
};

// ===============================
// Remove Cart Item
// ===============================
export const removeCartItem = async (productId) => {
  const response = await API.delete("/cart/remove", {
    data: { productId },
  });

  return response.data;
};

// ===============================
// Clear Cart
// ===============================
export const clearCart = async () => {
  const response = await API.delete("/cart/clear");
  return response.data;
};