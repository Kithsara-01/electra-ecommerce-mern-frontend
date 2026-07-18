import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./routes/ProtectedRoute";

import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";

import CustomerRegister from "./pages/CustomerRegister";

import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import AdminDashboard from "./pages/AdminDashboard";

import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import MyMessages from "./pages/MyMessages";
import MyMessageDetails from "./pages/MyMessageDetails";

import AdminProfile from "./pages/AdminProfile";
import AdminEditProfile from "./pages/AdminEditProfile";
import AdminProducts from "./pages/AdminProducts";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminEditProduct from "./pages/AdminEditProduct";
import AdminUsers from "./pages/AdminUsers";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import AdminStocks from "./pages/AdminStocks";
import CustomerCare from "./pages/CustomerCare";
import CustomerCareDetails from "./pages/CustomerCareDetails";

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
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/customer-register" element={<CustomerRegister />} />
        

        {/* Customer Shopping */}
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<ProtectedRoute allowedRoles={["Customer"]}> <Cart /> </ProtectedRoute>}/>
        <Route path="/my-messages" element={<ProtectedRoute allowedRoles={["Customer"]}> <MyMessages /> </ProtectedRoute> }/>
        <Route path="/my-messages/:id" element={<ProtectedRoute allowedRoles={["Customer"]}><MyMessageDetails /></ProtectedRoute>}/>

        {/* Customer */}
        <Route path="/profile" element={<ProtectedRoute allowedRoles={["Customer"]}><Profile /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute allowedRoles={["Customer"]}><EditProfile /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute allowedRoles={["Customer"]}><MyOrders /></ProtectedRoute>} />
        <Route path="/my-orders/:orderId" element={<ProtectedRoute allowedRoles={["Customer"]}><OrderDetails /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute allowedRoles={["Customer"]}>
      <Checkout />
      
    </ProtectedRoute>
  }
/>

        

        {/* Admin */}
        <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/stocks" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminStocks /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminProfile /></ProtectedRoute>} />
        <Route path="/admin/edit-profile" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminEditProfile /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminProducts /></ProtectedRoute>} />
        <Route path="/admin/products/add" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminAddProduct /></ProtectedRoute>} />
        <Route path="/admin/products/edit/:productId" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminEditProduct /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/orders/:orderId" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminOrderDetails /></ProtectedRoute>} />
        <Route path="/admin/customer-care" element={<ProtectedRoute allowedRoles={["Admin"]}> <CustomerCare /> </ProtectedRoute>}/>
        <Route path="/admin/customer-care/:id" element={<ProtectedRoute allowedRoles={["Admin"]}> <CustomerCareDetails />
    </ProtectedRoute>
  }
/>

      </Routes>
    </>
  );
}

export default App;