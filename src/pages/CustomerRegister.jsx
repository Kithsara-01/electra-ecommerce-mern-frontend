import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerCustomer } from "../services/authService";

import {
  FaUser,
  FaPhoneAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { MdEmail } from "react-icons/md";
import { FaLocationDot, FaCamera } from "react-icons/fa6";

function CustomerRegister() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone Number - Numbers Only (Max 10 Digits)
    if (name === "phone") {
      const phone = value.replace(/\D/g, "").slice(0, 10);

      setFormData((prev) => ({
        ...prev,
        phone,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await registerCustomer(formData);

      toast.success("Customer account created successfully!"); // success message ekak show karann kiyana eka

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
      });

      setProfileImage(null);
      setPreview(null);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-md border border-slate-200 bg-white p-8">

        <h1 className="text-2xl font-bold text-center text-slate-900">
          Customer Registration
        </h1>

        <p className="text-center text-sm text-slate-500 mt-2 mb-7">
          Create your customer account to start shopping.
        </p>

        <div className="flex flex-col items-center mb-7">
          <label
            htmlFor="profileImage"
            className="relative cursor-pointer group"
          >
            <img
              src={
                preview ||
                "https://ui-avatars.com/api/?name=User&background=E5E0D8&color=000"
              }
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-accent"
            />

            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white transition-colors group-hover:bg-secondary">
              <FaCamera className="text-xs" />
            </div>
          </label>

          <input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <p className="text-xs text-slate-500 mt-2.5">
            Profile Image (Optional)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-700">
              Full Name
            </label>

            <div className="relative">
              <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400" />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full rounded border border-slate-200 bg-white pl-11 pr-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-700">
              Email
            </label>

            <div className="relative">
              <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full rounded border border-slate-200 bg-white pl-11 pr-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-700">
              Phone Number
            </label>

            <div className="relative">
              <FaPhoneAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400" />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                maxLength={10}
                required
                className="w-full rounded border border-slate-200 bg-white pl-11 pr-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-700">
              Address
            </label>

            <div className="relative">
              <FaLocationDot className="absolute left-3.5 top-3.5 text-sm text-slate-400" />

              <textarea
                rows="3"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                className="w-full rounded border border-slate-200 bg-white pl-11 pr-4 py-2.5 text-sm text-slate-900 outline-none transition-colors resize-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-700">
              Password
            </label>

            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full rounded border border-slate-200 bg-white pl-11 pr-11 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-accent"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-accent"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-7 text-center">
          <p className="text-sm text-slate-500">
            Already have an account?
          </p>

          <Link
            to="/login"
            className="cursor-pointer text-sm font-medium text-accent transition-colors hover:text-secondary"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CustomerRegister;