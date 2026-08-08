import API from "./authService";

// =========================================
// Initialize PayHere Payment
// =========================================
export const initializePayment = async (paymentData) => {
  const response = await API.post("/payments/init", paymentData);
  return response.data;
};

// =========================================
// Complete PayHere Order
// =========================================
export const completePaymentOrder = async (orderData) => {
  const response = await API.post("/orders", orderData);
  return response.data;
};