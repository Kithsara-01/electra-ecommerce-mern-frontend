import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  logoutUser,
  getMyProfile,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===============================
  // Load Logged In User
  // ===============================
  const loadUser = async () => {
    try {
      const data = await getMyProfile();
      setUser(data);

    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // ===============================
  // Login
  // ===============================
  const login = async (userData) => {
    await loginUser(userData);

    const data = await getMyProfile();

    setUser(data);
  };

  // ===============================
  // Logout
  // ===============================
  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        setUser,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ===============================
// Custom Hook
// ===============================
export const useAuth = () => {
  return useContext(AuthContext);
};