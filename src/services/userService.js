import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Get All Users
export const getAllUsers = async (params = {}) => {
  const { data } = await API.get("/users", { params });
  return data;
};

// Get Single User
export const getUserById = async (id) => {
  const { data } = await API.get(`/users/${id}`);
  return data;
};

// Block User
export const blockUser = async (id) => {
  const { data } = await API.put(`/users/${id}/block`);
  return data;
};

// Unblock User
export const unblockUser = async (id) => {
  const { data } = await API.put(`/users/${id}/unblock`);
  return data;
};