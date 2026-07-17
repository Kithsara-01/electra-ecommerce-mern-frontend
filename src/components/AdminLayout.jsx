import { Link, useLocation } from "react-router-dom";

import logo from "../assets/electra-logo.png";
import AdminProfileDropdown from "./AdminProfileDropdown";

import { FaTachometerAlt, FaBoxOpen, FaUsers, FaShoppingCart, FaBoxes} from "react-icons/fa";

function AdminLayout({ title = "Admin Dashboard", children }) {

  const location = useLocation();
  
  return (
    <div className="min-h-screen flex bg-primary">
      {/* ================= Sidebar ================= */}
      <aside className="w-64 bg-white border-r border-border flex flex-col">
        {/* Logo */}
        <div className="flex justify-center py-8">
          <Link to="/admin-dashboard">
            <img
              src={logo}
              alt="Electra Logo"
              className="h-20 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3">
          {/* Dashboard */}
          <Link
            to="/admin-dashboard"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${
                  location.pathname === "/admin-dashboard"
                    ? "bg-primary text-accent font-semibold"
                    : "text-secondary hover:bg-primary"
                }`}          
          >
            <FaTachometerAlt />
            Dashboard
          </Link>

          {/* Products */}
          <Link
            to="/admin/products"
            className={`mt-2 flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              location.pathname === "/admin/products"
                ? "bg-primary text-accent font-semibold"
                : "text-secondary hover:bg-primary"
            }`}
          >
            <FaBoxOpen />
            Products
          </Link>

          {/* Users */}
          <Link
            to="/admin/users"
            className={`mt-2 flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              location.pathname === "/admin/users"
                ? "bg-primary text-accent font-semibold"
                : "text-secondary hover:bg-primary"
            }`}
          >

            <FaUsers />
            Users
          </Link>

          {/* Orders */}
          <Link
            to="/admin/orders"
            className={`mt-2 flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              location.pathname === "/admin/orders"
                ? "bg-primary text-accent font-semibold"
                : "text-secondary hover:bg-primary"
            }`}
          >
            
            <FaShoppingCart />
            Orders
          </Link>

          {/* Stock Management */}
          <Link
            to="/admin/stocks"
            className={`mt-2 flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              location.pathname === "/admin/stocks"
                ? "bg-primary text-accent font-semibold"
                : "text-secondary hover:bg-primary"
            }`}
          >
            <FaBoxes />
            Stock Management
          </Link>
        </nav>
      </aside>

      {/* ================= Main Content ================= */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-border px-10 py-7 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-secondary">
            {title}
          </h1>

          <AdminProfileDropdown />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;