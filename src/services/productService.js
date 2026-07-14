import API from "./authService";

// ===============================
// Create Product
// ===============================
export const createProduct = async (productData) => {

  const response = await API.post("/products", productData);

  return response.data;
};


// ===============================
// Get All Products
// ===============================
export const getAllProducts = async (params) => {

  const response = await API.get("/products", { params });

  return response.data;
};


// ===============================
// Get Product By ID
// ===============================
export const getProductById = async (productId) => {

  const response = await API.get(`/products/${productId}`);

  return response.data;
};


// ===============================
// Update Product
// ===============================
export const updateProduct = async (productId, productData) => {

  const response = await API.put(`/products/${productId}`, productData);

  return response.data;
};


// ===============================
// Delete Product
// ===============================
export const deleteProduct = async (productId) => {

  const response = await API.delete(`/products/${productId}`);

  return response.data;
};
