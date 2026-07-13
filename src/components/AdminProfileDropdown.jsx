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

//////////////  
  //const adminImage = user?.profileImage || defaultProfile;

const adminImage = user?.profileImage
  ? `${user.profileImage}?t=${Date.now()}`
  : defaultProfile;

////////

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
        className="flex items-center gap-3 rounded-xl px-3 py-2 cursor-pointer hover:bg-primary transition duration-200"
      >
        <img
          src={adminImage}
          alt={adminName}
          className="h-10 w-10 rounded-full object-cover border-2 border-border hover:border-accent transition duration-200"
        />

        <div className="text-right">
          <p className="text-sm font-semibold text-secondary">
            {adminName}
          </p>

          <p className="text-xs text-gray-500">
            Admin
          </p>
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl border border-border shadow-lg overflow-hidden z-50">

          {/* Menu Items */}
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

              <span>
                {item.label}
              </span>
            </button>
          ))}

          <hr className="border-border" />

          {/* Logout */}
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

export default AdminProfileDropdown;