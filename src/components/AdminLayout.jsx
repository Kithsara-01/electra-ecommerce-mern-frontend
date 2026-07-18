import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import logo from "../assets/electra-logo.png";
import AdminProfileDropdown from "./AdminProfileDropdown";
import { getUnreadMessageCount } from "../services/contactService";

import {
  FaTachometerAlt,FaBoxOpen,FaUsers, FaShoppingCart, FaBoxes, FaHeadset} from "react-icons/fa";

function AdminLayout({ title = "Admin Dashboard", children }) {

  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
  fetchUnreadCount();
}, []);

const fetchUnreadCount = async () => {
  try {
    const response = await getUnreadMessageCount();
    setUnreadCount(response.unreadCount);
  } catch (error) {
    console.error("Failed to fetch unread count:", error);
  }
};


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

          {/* Customer Care */}
            <Link
              to="/admin/customer-care"
              className={`mt-2 flex items-center justify-between px-4 py-3 rounded-lg transition ${
                location.pathname === "/admin/customer-care"
                  ? "bg-primary text-accent font-semibold"
                  : "text-secondary hover:bg-primary"
              }`}
            >
              <div className="flex items-center gap-3">
                <FaHeadset />
                <span>Customer Care</span>
              </div>

              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white">
                {unreadCount}
              </span>
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