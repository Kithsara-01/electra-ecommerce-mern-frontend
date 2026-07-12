import axios from "axios";

// Backend Base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});


// ===============================
// Customer Register
// ===============================
export const registerCustomer = async (userData) => {

  const response = await API.post("/auth/register/customer", userData);

  return response.data;
};


// ===============================
// Supplier Register
// ===============================
export const registerSupplier = async (userData) => {

  const response = await API.post("/auth/register/supplier", userData);
  
  return response.data;
};


// ===============================
// Login
// ===============================
export const loginUser = async (userData) => {

  const response = await API.post("/auth/login", userData);

  return response.data;
};


// ===============================
// Logout
// ===============================
export const logoutUser = async () => {

  const response = await API.post("/auth/logout");

  return response.data;
};

// ===============================
// Get My Profile
// ===============================
export const getMyProfile = async () => {

  const response = await API.get("/users/profile");

  return response.data;
};

// ===============================
// Update My Profile
// ===============================
export const updateMyProfile = async (userData) => {

  const response = await API.put("/users/profile", userData);
  
  return response.data;
};

export default API;


//test

//test 2