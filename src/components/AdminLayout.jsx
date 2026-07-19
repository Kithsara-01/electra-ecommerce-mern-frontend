import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import logo from "../assets/electra-logo.png";
import AdminProfileDropdown from "./AdminProfileDropdown";
import { getUnreadMessageCount } from "../services/contactService";

import {
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaShoppingCart,
  FaBoxes,
  FaHeadset,
} from "react-icons/fa";

const NAV_ITEMS = [
  { to: "/admin-dashboard", label: "Dashboard", icon: FaTachometerAlt },
  { to: "/admin/products", label: "Products", icon: FaBoxOpen },
  { to: "/admin/users", label: "Users", icon: FaUsers },
  { to: "/admin/orders", label: "Orders", icon: FaShoppingCart },
  { to: "/admin/stocks", label: "Stock Management", icon: FaBoxes },
];

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

  const navLinkClass = (path) =>
    `flex cursor-pointer items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors ${
      location.pathname === path
        ? "bg-accent/10 text-accent font-semibold"
        : "text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <div className="flex min-h-screen bg-primary">
      {/* ================= Sidebar ================= */}
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-white">
        {/* Logo */}
        <div className="flex justify-center py-8">
          <Link to="/admin-dashboard" className="cursor-pointer">
            <img
              src={logo}
              alt="Electra Logo"
              className="h-20 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className={navLinkClass(to)}>
              <Icon />
              {label}
            </Link>
          ))}

          {/* Customer Care */}
          <Link
            to="/admin/customer-care"
            className={`${navLinkClass("/admin/customer-care")} justify-between`}
          >
            <div className="flex items-center gap-3">
              <FaHeadset />
              <span>Customer Care</span>
            </div>

            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-600 px-1.5 text-xs font-semibold text-white">
              {unreadCount}
            </span>
          </Link>
        </nav>
      </aside>

      {/* ================= Main Content ================= */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-10 py-6">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>

          <AdminProfileDropdown />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-10">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;