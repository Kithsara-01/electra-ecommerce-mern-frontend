import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import defaultProfile from "../assets/default-profile.png";

import {
  FaUser,
  FaEdit,
  FaLock,
  FaSignOutAlt,
} from "react-icons/fa";

function AdminProfileDropdown() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const adminName = user?.name || "Admin";

  const adminImage = user?.profileImage
    ? `${user.profileImage}?t=${Date.now()}`
    : defaultProfile;

  const menuItems = [
    {
      label: "My Profile",
      icon: <FaUser />,
      path: "/admin/profile",
    },
    {
      label: "Edit Profile",
      icon: <FaEdit />,
      path: "/admin/edit-profile",
    },
    {
      label: "Change Password",
      icon: <FaLock />,
      path: "/admin/edit-profile",
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
      {/* Profile Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex cursor-pointer items-center gap-4 rounded-md px-3 py-2 transition-colors hover:bg-slate-100"
      >
        <img
          src={adminImage}
          alt={adminName}
          className="h-12 w-12 rounded-full border-2 border-slate-200 object-cover transition-colors hover:border-accent"
        />

        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">{adminName}</p>

          <p className="text-xs text-slate-500">Admin</p>
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded border border-slate-200 bg-white">
          {/* Menu Items */}
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleMenuClick(item.path)}
              className="flex w-full cursor-pointer items-center gap-3 px-5 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100"
            >
              <span className="text-accent">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <hr className="border-slate-100" />

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3 px-5 py-3 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50"
          >
            <FaSignOutAlt />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminProfileDropdown;