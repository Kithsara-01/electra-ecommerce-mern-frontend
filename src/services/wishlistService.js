import api from "./authService";

// Get logged-in user's wishlist
export const getWishlist = async () => {
  const response = await api.get("/wishlist");
  return response.data;


};

// Check if product is in wishlist
export const checkWishlist = async (productId) => {
  const response = await api.get(`/wishlist/check/${productId}`);
  return response.data;
};

// Add product to wishlist
export const addToWishlist = async (productId) => {
  const response = await api.post(`/wishlist/${productId}`);
  return response.data;
};

// Remove product from wishlist
export const removeFromWishlist = async (productId) => {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data;
};