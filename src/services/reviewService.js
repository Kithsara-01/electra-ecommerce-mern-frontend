import API from "./authService";

// Create Review
export const createReview = async (reviewData) => {
  const response = await API.post("/reviews", reviewData);
  return response.data;
};

// Get Reviews by Product
export const getProductReviews = async (productId) => {
  const response = await API.get(`/reviews/product/${productId}`);
  return response.data;
};

// Update Review
export const updateReview = async (id, reviewData) => {
  const response = await API.put(`/reviews/${id}`, reviewData);
  return response.data;
};

// Delete Review
export const deleteReview = async (id) => {
  const response = await API.delete(`/reviews/${id}`);
  return response.data;
};