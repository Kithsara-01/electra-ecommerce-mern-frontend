import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCamera,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaLock,
} from "react-icons/fa";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import {updateMyProfile, changePassword,} from "../services/authService";
import toast from "react-hot-toast";

import defaultProfile from "../assets/default-profile.png";

function EditProfile() {
  const navigate = useNavigate();
  const { user, loadUser, logout } = useAuth();

  const [formData, setFormData] = useState({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      profileImage: user?.profileImage || "",
    });

    const [passwordData, setPasswordData] = useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const handleChange = (e) => {
      let { name, value } = e.target;

      if (name === "phone") {
        value = value.replace(/\D/g, "").slice(0, 10);
      }

      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

  const handlePasswordChangeInput = (e) => {
      const { name, value } = e.target;

      setPasswordData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

  const handleSubmit = async () => {
    try {
      const response = await updateMyProfile(formData);

      await loadUser();

      toast.success(response.message);

      navigate("/profile");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  };     
  
    const handlePasswordSubmit = async () => {
    try {

      const response = await changePassword(passwordData);

      toast.success(response.message);

      // Logout user
      await logout();

      // Redirect to login page
      navigate("/login");

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Failed to change password."
      );

    }
  };

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);




  return (
    <div className="min-h-screen bg-primary px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">

          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-md hover:bg-gray-50 hover:shadow-lg transition duration-300 cursor-pointer"
          >
            <FaArrowLeft className="text-secondary" />

            <span className="font-semibold text-secondary">
              Back
            </span>
          </button>

          <h1 className="text-4xl font-bold text-secondary">
            Edit Profile
          </h1>

          <div className="w-24"></div>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Personal Information */}
          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-2xl font-bold text-secondary mb-8">
              Personal Information
            </h2>

            {/* Profile Image */}
            <div className="flex flex-col items-center mb-10">

              <img
                src={user?.profileImage || defaultProfile}
                alt="Profile"
                className="w-36 h-36 rounded-full border-4 border-accent shadow-lg object-cover"
              />

              <button
                className="mt-5 flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-full hover:bg-teal-700 transition duration-300 cursor-pointer"
              >
                <FaCamera />

                <span>Change Photo</span>

              </button>

            </div>

            {/* Full Name */}
            <div>

              <label className="block text-sm font-semibold text-secondary mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />

            </div>

            {/* Email */}
            <div className="mt-6">

              <label className="block text-sm font-semibold text-secondary mb-2">
                Email
              </label>

              <input
                type="email"
                defaultValue={user?.email}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />

            </div>

            {/* Phone */}
            <div className="mt-6">

              <label className="block text-sm font-semibold text-secondary mb-2">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                inputMode="numeric"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />

            </div>

            {/* Address */}
            <div className="mt-6">

              <label className="block text-sm font-semibold text-secondary mb-2">
                Address
              </label>

              <textarea
                rows="4"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-accent"
              />

            </div>

            {/* Save Button */}
            <div className="mt-8">

              <button
                onClick={handleSubmit}
                className="w-full bg-accent text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-teal-700 transition duration-300 cursor-pointer"
              >
                <FaSave />

                Save Changes

              </button>

            </div>

          </div>

          {/* Security */}
          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-2xl font-bold text-secondary mb-8">
              Change Password
            </h2>
                        {/* Current Password */}
            <div>

              <label className="block text-sm font-semibold text-secondary mb-2">
                Current Password
              </label>

              <div className="relative">

                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChangeInput}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-accent"
                />

                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-accent transition cursor-pointer"
                >
                  <button
                    type="button"
                    onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-accent transition cursor-pointer"
                    >
                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </button>

              </div>

            </div>

            {/* New Password */}
            <div className="mt-6">

              <label className="block text-sm font-semibold text-secondary mb-2">
                New Password
              </label>

              <div className="relative">

                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChangeInput}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-accent"
                />

                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-accent transition cursor-pointer"
                >
                  <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-accent transition cursor-pointer"
                >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                </button>

              </div>

            </div>

            {/* Confirm Password */}
            <div className="mt-6">

              <label className="block text-sm font-semibold text-secondary mb-2">
                Confirm New Password
              </label>

              <div className="relative">

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChangeInput}
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-accent"
                />

                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-accent transition cursor-pointer"
                >
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-accent transition cursor-pointer"
                    >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </button>

              </div>

            </div>

            {/* Password Requirements */}
            <div className="mt-6 rounded-xl bg-gray-50 border border-gray-200 p-4">

              <h3 className="font-semibold text-secondary mb-2">
                To create Better password follow them,
              </h3>

              <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                <li>Use Minimum 8 characters</li>
                <li>Use At least one uppercase letter</li>
                <li>Use At least one lowercase letter</li>
                <li>Use At least one number</li>
                <li>Use At least one special character</li>
              </ul>

            </div>

            {/* Update Password Button */}
            <div className="mt-8">

              <button
                onClick={handlePasswordSubmit}
                className="w-full bg-secondary text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-900 transition duration-300 cursor-pointer"
              >
                <FaLock />

                Change Password

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default EditProfile;