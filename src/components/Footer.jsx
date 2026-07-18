import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            ELECTRA
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Your trusted destination for laptops, monitors, printers and
            electronic accessories.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Quick Links
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Customer */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Customer
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li><Link to="/cart">Shopping Cart</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/customer-register">Register</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Contact
          </h3>

          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>Colombo, Sri Lanka</p>
            <p>+94 77 123 4567</p>
            <p>support@electra.com</p>
          </div>
        </div>

      </div>

      <div className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Electra. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;