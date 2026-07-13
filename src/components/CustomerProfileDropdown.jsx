import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import defaultProfile from "../assets/default-profile.png";

import {
  FaUser,
  FaEdit,
  FaShoppingBag,
  FaSignOutAlt,
} from "react-icons/fa";

function CustomerProfileDropdown() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const customerName = user?.name || "Customer";

  const customerImage = user?.profileImage || defaultProfile;

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
        className="flex items-center gap-3 rounded-xl px-4 py-2 cursor-pointer
                  hover:bg-white/60 hover:shadow-md
                  transition-all duration-300"
      >
        <img
          src={customerImage}
          alt={customerName}
          className="h-14 w-14 rounded-full object-cover border-2 border-border transition-all duration-300 group-hover:border-accent"        
        />

        <div className="flex flex-col items-start leading-tight">
          <p className="text-base font-semibold text-secondary">
            {customerName}
          </p>

          <p className="text-sm text-gray-500">
            Customer
          </p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl border border-border shadow-lg overflow-hidden z-50">

          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleMenuClick(item.path)}
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-secondary hover:bg-primary transition duration-200"
            >
              <span className="text-accent">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </button>
          ))}

          <hr className="border-border" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition duration-200"
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