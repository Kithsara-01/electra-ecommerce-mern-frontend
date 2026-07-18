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

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/products", label: "Products" },
    { to: "/contact", label: "Contact" },
    { to: "/wishlist", label: "Wishlist" },
  ];

  return (
    <nav className="border-b border-slate-200 bg-primary">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Electra Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <ul className="flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="text-sm font-medium text-secondary transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Authentication Section */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link
                to="/login"
                className="cursor-pointer rounded border border-accent px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/customer-register"
                className="cursor-pointer rounded bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-secondary"
              >
                Register
              </Link>
            </>
          ) : user.role === "Customer" ? (
            <>
              <Link
                to="/cart"
                className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded border border-slate-200 text-slate-600 transition-colors hover:border-accent hover:text-accent"
                title="Shopping Cart"
              >
                <FiShoppingCart className="text-lg" />
                {cartQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-bold text-white">
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