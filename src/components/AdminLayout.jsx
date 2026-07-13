import { Link } from "react-router-dom";

import logo from "../assets/electra-logo.png";

import {
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaShoppingCart,
} from "react-icons/fa";

function AdminLayout({ children }) {
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
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-accent font-semibold transition"
          >
            <FaTachometerAlt />
            Dashboard
          </Link>

          {/* Products */}
          <Link
            to="#"
            className="mt-2 flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:bg-primary transition"
          >
            <FaBoxOpen />
            Products
          </Link>

          {/* Users */}
          <Link
            to="#"
            className="mt-2 flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:bg-primary transition"
          >
            <FaUsers />
            Users
          </Link>

          {/* Orders */}
          <Link
            to="#"
            className="mt-2 flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:bg-primary transition"
          >
            <FaShoppingCart />
            Orders
          </Link>
        </nav>
      </aside>

      {/* ================= Main Content ================= */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-border px-10 py-7 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-secondary">
            Admin Dashboard
          </h1>

          {/* Temporary */}
          <div className="text-gray-500 font-medium">
            Welcome, Admin 👋
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;