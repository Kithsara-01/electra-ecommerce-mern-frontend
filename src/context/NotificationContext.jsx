import { createContext, useContext, useEffect, useState } from "react";

import { useAuth } from "./AuthContext";
import { getCustomerUnreadReplyCount } from "../services/contactService";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useAuth();

  const [unreadReplyCount, setUnreadReplyCount] = useState(0);

  useEffect(() => {
    if (user?.role === "Customer") {
      loadUnreadReplyCount();
    } else {
      setUnreadReplyCount(0);
    }
  }, [user]);

  const loadUnreadReplyCount = async () => {
    try {
      const response = await getCustomerUnreadReplyCount();

      setUnreadReplyCount(response.unreadReplyCount || 0);
    } catch (error) {
      console.error("Failed to load unread reply count:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadReplyCount,
        loadUnreadReplyCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);