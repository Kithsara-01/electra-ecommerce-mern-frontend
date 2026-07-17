import API from "./authService";

// ===============================
// Place Order
// ===============================
export const placeOrder = async (orderData) => {
  const response = await API.post("/orders", orderData);
  return response.data;
};

// ===============================
// Get My Orders
// ===============================
export const getMyOrders = async () => {
  const response = await API.get("/orders/my-orders");
  return response.data;
};

// ===============================
// Get Single Order
// ===============================
export const getOrderById = async (orderId) => {
  const response = await API.get(`/orders/${orderId}`);
  return response.data;
};

// ===============================
// Get All Orders (Admin)
// ===============================
export const getAllOrders = async (
  page = 1,
  limit = 10,
  search = "",
  status = "All"
    ) => {
      const response = await API.get("/orders", {
        params: {
          page,
          limit,
          search,
          status,
        },
      });

      return response.data;
    };

// ===============================
// Update Order Status (Admin)
// ===============================
export const updateOrderStatus = async (orderId, orderStatus) => {
  const response = await API.put(`/orders/${orderId}`, {
    orderStatus,
  });

  return response.data;
};

// ===============================
// Cancel Order (Customer)
// ===============================
export const cancelOrder = async (orderId) => {
  const response = await API.put(`/orders/${orderId}/cancel`);
  return response.data;
};