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

      toast.success("Customer account created successfully!");

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
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-secondary">
          Customer Registration
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Create your customer account to start shopping.
        </p>

        <div className="flex flex-col items-center mb-8">
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
              className="w-28 h-28 rounded-full object-cover border-4 border-accent"
            />

            <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white group-hover:brightness-90 transition">
              <FaCamera />
            </div>
          </label>

          <input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <p className="text-sm text-gray-500 mt-3">
            Profile Image (Optional)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
            <label className="block mb-2 font-medium text-secondary">
              Full Name
            </label>

            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-secondary">
              Email
            </label>

            <div className="relative">
              <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-secondary">
              Phone Number
            </label>

            <div className="relative">
              <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                maxLength={10}
                required
                className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-secondary">
              Address
            </label>

            <div className="relative">
              <FaLocationDot className="absolute left-4 top-4 text-gray-400" />

              <textarea
                rows="3"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 resize-none focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-secondary">
              Password
            </label>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full border border-gray-300 rounded-lg pl-12 pr-12 py-3 focus:outline-none focus:border-accent"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-accent transition"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white py-3 rounded-lg hover:brightness-90 transition duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?
          </p>

          <Link
            to="/login"
            className="text-accent font-medium hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CustomerRegister;