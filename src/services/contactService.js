import API from "./authService";

// ==============================
// Customer
// ==============================
export const sendContactMessage = async (messageData) => {
  const response = await API.post("/contact", messageData);

  return response.data;
};

export const getMyContactMessages = async () => {
  const response = await API.get("/contact/my-messages");

  return response.data;
};

export const getMyContactMessageById = async (id) => {
  const response = await API.get(`/contact/my-messages/${id}`);

  return response.data;
};

export const getCustomerUnreadReplyCount = async () => {
  const response = await API.get("/contact/unread-replies-count");

  return response.data;
};

// ==============================
// Admin
// ==============================
export const getUnreadMessageCount = async () => {
  const response = await API.get("/contact/unread-count");

  return response.data;
};

export const getAllContactMessages = async () => {
  const response = await API.get("/contact");

  return response.data;
};

export const getContactMessageById = async (id) => {
  const response = await API.get(`/contact/${id}`);

  return response.data;
};

export const markMessageAsRead = async (id) => {
  const response = await API.put(`/contact/${id}/read`);

  return response.data;
};

export const replyToContactMessage = async (id, message) => {
  const response = await API.put(`/contact/${id}/reply`, {
    message,
  });

  return response.data;
};

export const deleteContactMessage = async (id) => {
  const response = await API.delete(`/contact/${id}`);

  return response.data;
};