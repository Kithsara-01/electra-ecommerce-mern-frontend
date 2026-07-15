import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { useEffect, useState } from "react";

import logo from "../assets/electra-logo.png";

import { useAuth } from "../context/AuthContext";
import { getCart } from "../services/cartService";

import CustomerProfileDropdown from "./CustomerProfileDropdown";

function Navibar() {
  const { user } = useAuth();
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    if (user?.role === "Customer") {
      loadCartQuantity();
    }
  }, [user]);

  const loadCartQuantity = async () => {
    try {
      const response = await getCart();
      const totalQuantity = (response.cart.items || []).reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartQuantity(totalQuantity);
    } catch (error) {
      // Silently handle errors
      console.error("Failed to load cart quantity:", error);
    }
  };

  const formatBadgeNumber = (num) => {
    return num > 99 ? "99+" : num;
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
            <>
              <Link
                to="/cart"
                className="relative flex items-center justify-center h-11 w-11 rounded-lg bg-slate-100 text-slate-600 hover:bg-accent hover:text-white transition duration-300"
                title="Shopping Cart"
              >
                <FiShoppingCart className="text-lg" />
                {cartQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center min-h-5 min-w-5 rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                    {formatBadgeNumber(cartQuantity)}
                  </span>
                )}
              </Link>
              <CustomerProfileDropdown />
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

export default Navibar;