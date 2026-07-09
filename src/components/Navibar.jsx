import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import logo from "../assets/electra-logo.png";
import defaultProfile from "../assets/default-profile.png";

import { useAuth } from "../context/AuthContext";



// popup image profiel icons imports
import { FaUserCircle } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { FaChevronRight } from "react-icons/fa";

function Navibar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);




  // ===============================
  // Logout
  // ===============================
  const handleLogout = async () => {
  try {

    await logout();

    toast.success("Logged out successfully!");

    setIsOpen(false);

    navigate("/");

  } catch (error) {

    toast.error("Logout failed.");

    console.error(error);

  }
  };



  return (
    <nav className="bg-primary border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Electra Logo"
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <ul className="flex items-center gap-8">
          <li>
            <Link
              to="/"
              className="text-secondary hover:text-accent transition"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/about"
              className="text-secondary hover:text-accent transition"
            >
              About
            </Link>
          </li>

          <li>
            <Link
              to="/products"
              className="text-secondary hover:text-accent transition"
            >
              Products
            </Link>
          </li>

          <li>
            <Link
              to="/contact"
              className="text-secondary hover:text-accent transition"
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Authentication Section */}
        <div className="flex items-center gap-3">
          {!user ? (  // usr null nam me tika
            <>
              <Link
                to="/login"
                className="border border-accent px-4 py-2 rounded-lg text-accent hover:bg-accent hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/customer-register"
                className="bg-accent px-4 py-2 rounded-lg text-white hover:opacity-85 transition duration-300"
              >
                Register
              </Link>
            </>
          ) : user.role === "Customer" ? (
          <div className="relative">

            <img
              src={user.profileImage || defaultProfile}
              alt="Profile"
              onClick={() => setIsOpen(!isOpen)}
              className="w-11 h-11 rounded-full border-2 border-accent object-cover cursor-pointer"
            />

            {isOpen && (
              <div className="absolute right-0 top-14 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                <div className="p-6 text-center">

                  <img
                    src={user.profileImage || defaultProfile}
                    alt="Profile"
                    className="w-20 h-20 rounded-full mx-auto border-2 border-accent object-cover"
                  />

                  <h3 className="mt-3 text-lg font-semibold">
                    {user.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {user.email}
                  </p>

                  <hr className="my-5 border-gray-200" />

                  <div className="py-2">

                    {/* My Profile */}
                    <button
                        onClick={() => {
                          setIsOpen(false);
                          navigate("/profile");
                        }}
                        className="w-full flex items-center justify-between px-6 py-3 hover:bg-accent/10 transition duration-200"
                      >
                      <div className="flex items-center gap-3">
                        <FaUserCircle className="text-lg text-accent" />
                        <span className="text-secondary font-medium">
                          My Profile
                        </span>
                      </div>

                      <FaChevronRight className="text-gray-400 text-sm" />
                    </button>

                    {/* Edit Profile */}
                    <button
                        onClick={() => {
                          setIsOpen(false);
                          navigate("/edit-profile");
                        }}
                      className="w-full flex items-center justify-between px-6 py-3 hover:bg-accent/10 transition duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <FaUserEdit className="text-lg text-accent" />
                        <span className="text-secondary font-medium">
                          Edit Profile
                        </span>
                      </div>

                      <FaChevronRight className="text-gray-400 text-sm" />
                    </button>

                    {/* Orders */}
                    <button
                        onClick={() => {
                          setIsOpen(false);
                          navigate("/my-orders");
                        }}
                      className="w-full flex items-center justify-between px-6 py-3 hover:bg-accent/10 transition duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <FaBoxOpen className="text-lg text-accent" />
                        <span className="text-secondary font-medium">
                          My Orders
                        </span>
                      </div>

                      <FaChevronRight className="text-gray-400 text-sm" />
                    </button>

                    <hr className="my-2 border-gray-200" />

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 transition duration-200"
                    >
                      <FiLogOut className="text-lg" />

                      <span className="font-medium">
                        Logout
                      </span>
                    </button>

                  </div>

                </div>

              </div>
            )}

          </div>
        ) : null}
        </div>
      </div>
    </nav>
  );
}

export default Navibar;