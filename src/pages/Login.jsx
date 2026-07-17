import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";



import { MdEmail } from "react-icons/md";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const user = await login(formData);

      console.log("Returned User:", user);

      toast.success("Login successful!");

      // const user = response.user;

      
        if (user.role === "Customer") {

          navigate("/");

        } else if (user.role === "Admin") {

          navigate("/admin-dashboard");

        } 

      

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-secondary">
          Login
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Welcome back! Please login to your account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
                    {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block mb-2 font-medium text-secondary">
              Password
            </label>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400" />

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

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white py-3 rounded-lg hover:brightness-90 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Links */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?
          </p>

          <div className="flex justify-center mt-3">
            <Link
              to="/customer-register"
              className="text-accent hover:underline font-medium"
            >
              Create Account
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;