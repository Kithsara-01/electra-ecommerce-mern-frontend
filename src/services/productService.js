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
// Get All Products (Admin)
// ===============================
export const getAllAdminProducts = async (params) => {

  const response = await API.get("/products/admin", { params });

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
// Search Products
// ===============================
export const searchProducts = async (query) => {

  const response = await API.get(`/products/search/${encodeURIComponent(query)}`);

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
// Update Product Stock
// ===============================
export const updateProductStock = async (productId, stock) => {
  const response = await API.patch(`/products/${productId}/stock`, {
    stock,
  });

  return response.data;
};

// ===============================
// Toggle Product Availability
// ===============================
export const updateProductAvailability = async (
  productId,
  isAvailable
) => {

  const response = await API.put(
    `/products/${productId}`,
    {
      isAvailable,
    }
  );

  return response.data;

};

// ===============================
// Delete Product
// ===============================
export const deleteProduct = async (productId) => {

  const response = await API.delete(`/products/${productId}`);

  return response.data;
};


// ===============================
// Generate AI Product Description
// ===============================
export const generateAIDescription = async (productData) => {

  const response = await API.post(
    "/products/ai-description",
    productData
  );

  return response.data;
};


export const generateAIAlternativeNames = async (data) => {
  const response = await API.post(
    "/products/ai-alternative-names",
    data
  );

  return response.data;
};