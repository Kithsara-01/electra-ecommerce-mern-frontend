import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./routes/ProtectedRoute";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SupplierRegister from "./pages/SupplierRegister";
import CustomerRegister from "./pages/CustomerRegister";

import CustomerDashboard from "./pages/CustomerDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import AdminDashboard from "./pages/AdminDashboard";





function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 8000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
          success: {
            style: {
              background: "#16a34a",
            },
          },
          error: {
            style: {
              background: "#dc2626",
            },
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/customer-register" element={<CustomerRegister />} />
        <Route path="/supplier-register" element={<SupplierRegister />} />

        {/* Dashboard Routes */}
        
        <Route
          path="/customer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Customer"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/supplier-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Supplier"]}>
              <SupplierDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


      </Routes>
    </>
  );
}

export default App;