import { Link } from "react-router-dom";

import logo from "../assets/electra-logo.png";

import { useAuth } from "../context/AuthContext";

import CustomerProfileDropdown from "./CustomerProfileDropdown";

function Navibar() {
  const { user } = useAuth();

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
          {!user ? (
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
            <CustomerProfileDropdown />
          ) : null}
        </div>
      </div>
    </nav>
  );
}

export default Navibar;