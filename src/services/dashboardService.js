import API from "./authService";

export const getDashboardStats = async () => {
  const response = await API.get("/dashboard/stats");
  return response.data;
};

export const getRevenueAnalytics = async (filter = "monthly") => {
  const response = await API.get(
    `/dashboard/revenue?filter=${filter}`
  );

  return response.data;
};

export const getNotificationCounts = async () => {
  const response = await API.get("/dashboard/notifications");

  return response.data;
};

