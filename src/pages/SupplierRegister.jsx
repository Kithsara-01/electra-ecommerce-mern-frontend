import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerSupplier } from "../services/authService";

import {
  FaCamera,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUser,
} from "react-icons/fa";

const SupplierRegister = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    profileImage: null,
  });

  const [preview, setPreview] = useState("");

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      profileImage: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

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

      await registerSupplier({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
      });

      toast.success("Supplier account created successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        profileImage: null,
      });

      setPreview("");

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
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-secondary">
            Supplier Register
          </h1>

          <p className="text-gray-500 mt-2">
            Create your supplier account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="flex justify-center">
            <div
              onClick={handleImageClick}
              className="relative cursor-pointer group"
            >
              <img
                src={
                  preview ||
                  "https://ui-avatars.com/api/?name=Supplier&background=E5E0D8&color=000000&size=200"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-accent shadow-md"
              />

              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <FaCamera className="text-white text-2xl" />
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <p className="text-center text-sm text-gray-500">
            Profile image is optional
          </p>
                    {/* Full Name */}
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Address */}
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-4 top-5 text-gray-500" />

            <textarea
              name="address"
              rows="4"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:brightness-90 transition duration-300 text-white py-3 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register as Supplier"}
          </button>

          {/* Login */}
          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-accent font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SupplierRegister;