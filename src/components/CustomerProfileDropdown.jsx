import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import defaultProfile from "../assets/default-profile.png";

import {
  FaUser,
  FaEdit,
  FaShoppingBag,
  FaEnvelope,
  FaSignOutAlt,
} from "react-icons/fa";

function CustomerProfileDropdown() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { unreadReplyCount } = useNotification();

  const [isOpen, setIsOpen] = useState(false);

  const customerName = user?.name || "Customer";

  const customerImage = user?.profileImage || defaultProfile;

  const formatBadgeNumber = (num) => {
    return num > 99 ? "99+" : num;
  };

  const menuItems = [
    {
      label: "My Profile",
      icon: <FaUser />,
      path: "/profile",
    },
    {
      label: "Edit Profile",
      icon: <FaEdit />,
      path: "/edit-profile",
    },
    {
      label: "My Orders",
      icon: <FaShoppingBag />,
      path: "/my-orders",
    },
    {
      label: "My Messages",
      icon: <FaEnvelope />,
      path: "/my-messages",
      badge: unreadReplyCount,
    },
  ];

  const handleMenuClick = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    setIsOpen(false);

    try {
      await logout();

      toast.success("Logged out successfully!");

      navigate("/");
    } catch (error) {
      toast.error("Logout failed.");
      console.error(error);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex cursor-pointer items-center gap-2.5 rounded px-2.5 py-1.5 transition-colors hover:bg-white"
      >
        <div className="relative">
          <img
            src={customerImage}
            alt={customerName}
            className="h-10 w-10 rounded-full border border-slate-200 object-cover"
          />

          {unreadReplyCount > 0 && (
            <span className="absolute -top-2 -right-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-bold text-white">
              {formatBadgeNumber(unreadReplyCount)}
            </span>
          )}
        </div>

        <div className="hidden flex-col items-start leading-tight sm:flex">
          <p className="text-sm font-semibold text-slate-900">
            {customerName}
          </p>

          <p className="text-xs text-slate-500">
            Customer
          </p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-md border border-slate-200 bg-white">

          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleMenuClick(item.path)}
              className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-accent"
            >
              <span className="text-accent">
                {item.icon}
              </span>

              <div className="flex w-full items-center justify-between">
              <span>{item.label}</span>

              {item.badge > 0 && (
                <span className="flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-bold text-white">
                  {formatBadgeNumber(item.badge)}
                </span>
              )}
            </div>
            </button>
          ))}

          <hr className="border-slate-100" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50"
          >
            <FaSignOutAlt />

            <span className="font-medium">
              Logout
            </span>
          </button>

        </div>
      )}
    </div>
  );
}

export default CustomerProfileDropdown;