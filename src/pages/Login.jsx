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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-md border border-slate-200 bg-white p-8">

        <h1 className="text-2xl font-bold text-center text-slate-900">
          Login
        </h1>

        <p className="text-center text-sm text-slate-500 mt-2 mb-7">
          Welcome back! Please login to your account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Email */}
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

          {/* Password */}
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

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Links */}
        <div className="mt-7 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account?
          </p>

          <div className="flex justify-center mt-2">
            <Link
              to="/customer-register"
              className="cursor-pointer text-sm font-medium text-accent transition-colors hover:text-secondary"
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