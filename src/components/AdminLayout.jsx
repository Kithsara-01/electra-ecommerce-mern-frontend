import { Link, useLocation } from "react-router-dom";

import logo from "../assets/electra-logo.png";
import AdminProfileDropdown from "./AdminProfileDropdown";
import { useAdminNotification } from "../context/AdminNotificationContext";

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
  const { notifications } = useAdminNotification();

  const navLinkClass = (path) =>
    `flex cursor-pointer items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors ${
      location.pathname === path
        ? "bg-white/15 text-white font-semibold"
        : "text-white/80 hover:bg-white/10 hover:text-white"
    }`;

  return (
    // Neutral slate-50 fill — matches the rest of the site (e.g. Contact page)
    // instead of the theme's primary/brand color, which reads as a tan/brown
    // tint when used as a large background surface.
    <div className="flex min-h-screen bg-slate-50">
      {/* ================= Sidebar ================= */}
      <aside className="flex w-64 flex-col bg-[#096B68]">
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
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            let badge = 0;

            if (to === "/admin/orders") {
              badge = notifications.pendingOrders;
            }

            if (to === "/admin/stocks") {
              badge =
                notifications.lowStockProducts +
                notifications.outOfStockProducts;
            }

            return (
              <Link
                key={to}
                to={to}
                className={`${navLinkClass(to)} justify-between`}
              >
                <div className="flex items-center gap-3">
                  <Icon />
                  <span>{label}</span>
                </div>

                {badge > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-600 px-1.5 text-xs font-semibold text-white">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Customer Care */}
          <Link
            to="/admin/customer-care"
            className={`${navLinkClass("/admin/customer-care")} justify-between`}
          >
            <div className="flex items-center gap-3">
              <FaHeadset />
              <span>Customer Care</span>
            </div>

            {notifications.unreadMessages > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-600 px-1.5 text-xs font-semibold text-white">
                {notifications.unreadMessages}
              </span>
            )}
          </Link>
        </nav>
      </aside>

      {/* ================= Main Content ================= */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-primary px-10 py-6">
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