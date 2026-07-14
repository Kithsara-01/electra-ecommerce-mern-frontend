import AdminAddProduct from "./pages/AdminAddProduct";

import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./routes/ProtectedRoute";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SupplierRegister from "./pages/SupplierRegister";
import CustomerRegister from "./pages/CustomerRegister";

import SupplierDashboard from "./pages/SupplierDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import MyOrders from "./pages/MyOrders";
import Product from "./pages/Products";

import AdminProfile from "./pages/AdminProfile";
import AdminEditProfile from "./pages/AdminEditProfile";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";
import AdminOrders from "./pages/AdminOrders";




function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2500,
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

        

        <Route path="/profile" element={ <ProtectedRoute allowedRoles={["Customer"]}> <Profile /> </ProtectedRoute> } />
        <Route path="/edit-profile" element={<ProtectedRoute allowedRoles={["Customer"]}> <EditProfile /></ProtectedRoute> } />
        <Route path="/my-orders" element={ <ProtectedRoute allowedRoles={["Customer"]}> <MyOrders /> </ProtectedRoute> }/>
        <Route path="/supplier-dashboard" element={<ProtectedRoute allowedRoles={["Supplier"]}> <SupplierDashboard /></ProtectedRoute>}/>
        <Route path="/admin-dashboard" element={ <ProtectedRoute allowedRoles={["Admin"]}> <AdminDashboard /> </ProtectedRoute>} />

        <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={["Admin"]}> <AdminProfile /> </ProtectedRoute>} />
        <Route path="/admin/edit-profile" element={<ProtectedRoute allowedRoles={["Admin"]}> <AdminEditProfile /> </ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute allowedRoles={["Admin"]}> <AdminProducts /> </ProtectedRoute>} />
        <Route path="/admin/products/add" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminAddProduct /></ProtectedRoute>}/>
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["Admin"]}> <AdminUsers /> </ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={["Admin"]}> <AdminOrders /> </ProtectedRoute>} />
        
        <Route path="/products" element={<Product />} />
          
      </Routes>
    </>
  );
}

export default App;