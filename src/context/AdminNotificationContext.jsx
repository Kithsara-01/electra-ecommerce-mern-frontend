import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getNotificationCounts } from "../services/dashboardService";

const AdminNotificationContext = createContext(null);

const DEFAULT_COUNTS = {
  pendingOrders: 0,
  lowStockProducts: 0,
  outOfStockProducts: 0,
  unreadMessages: 0,
};

export function AdminNotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(DEFAULT_COUNTS);

  const refreshNotifications = useCallback(async () => {
    try {
      const response = await getNotificationCounts();
      setNotifications(response.notifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, []);

  useEffect(() => {
    refreshNotifications();

    // Background safety net — catches anything not covered by an explicit
    // refreshNotifications() call elsewhere (e.g. another admin's action).
    const interval = setInterval(refreshNotifications, 10000);

    return () => clearInterval(interval);
  }, [refreshNotifications]);

  return (
    <AdminNotificationContext.Provider
      value={{ notifications, refreshNotifications }}
    >
      {children}
    </AdminNotificationContext.Provider>
  );
}

export function useAdminNotification() {
  const context = useContext(AdminNotificationContext);

  if (!context) {
    throw new Error(
      "useAdminNotification must be used within an AdminNotificationProvider"
    );
  }

  return context;
}