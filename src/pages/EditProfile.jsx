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

import { supabase } from "../services/supabase";
import { getMyProfile } from "../services/authService";



function EditProfile() {
  const navigate = useNavigate();
  const { user, loadUser, logout } = useAuth();

  const [formData, setFormData] = useState({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      profileImage: user?.profileImage || "",
    });

    const [selectedImage, setSelectedImage] = useState(null);
        const [previewImage, setPreviewImage] = useState(
          user?.profileImage || defaultProfile
        );

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

    const handleImageChange = (e) => {
      const file = e.target.files[0];

      if (!file) return;

      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
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
        let imageUrl = user?.profileImage || "";

        // Upload new image if selected
        if (selectedImage) {

          // Delete old image
          if (
            user?.profileImage &&
            user.profileImage.includes("/storage/v1/object/public/images/")
          ) {
            const oldFileName = user.profileImage.split("/images/")[1];

            const { error: deleteError } = await supabase.storage
              .from("images")
              .remove([oldFileName]);

            if (deleteError) {
              console.error(deleteError);
            } else {
              console.log("Old image deleted successfully");
            }
          }

          // Upload new image
          const fileName = `${Date.now()}-${selectedImage.name}`;

          const { error } = await supabase.storage
            .from("images")
            .upload(fileName, selectedImage);

          if (error) {
            throw error;
          }

          const { data } = supabase.storage
            .from("images")
            .getPublicUrl(fileName);

          imageUrl = data.publicUrl;

          console.log("Uploaded URL:", imageUrl);
        }

        const response = await updateMyProfile({
          ...formData,
          profileImage: imageUrl,
        });

        await loadUser();

        const latest = await getMyProfile();
        console.log("Database returned:", latest.user.profileImage);

        toast.success(response.message);

        navigate("/profile");

      } catch (error) {

        console.error(error);

        toast.error(
          error.response?.data?.message ||
          error.message ||
          "Failed to update profile"
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

  const inputClass =
    "w-full rounded border border-slate-900/15 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-accent";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">

          <button
            onClick={() => navigate("/profile")}
            className="flex cursor-pointer items-center gap-2.5 rounded border border-slate-900/15 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-accent hover:text-accent"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back</span>
          </button>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Edit Profile
          </h1>

          <div className="w-20"></div>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Personal Information */}
          <div className="rounded-md border border-slate-900/10 bg-white p-6">

            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-6">
              Personal Information
            </h2>

            {/* Profile Image */}
            <div className="flex flex-col items-center mb-8">

             <img
                src={previewImage}
                alt="Profile"
                className="w-32 h-32 rounded-full border-2 border-accent object-cover"
              />

              <label className="mt-4 flex cursor-pointer items-center gap-2 rounded bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary">

                <FaCamera className="text-xs" />

                <span>Change Photo</span>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

              </label>

            </div>

            {/* Full Name */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
              />

            </div>

            {/* Email */}
            <div className="mt-4">

              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>

              <input
                type="email"
                defaultValue={user?.email}
                className={inputClass}
              />

            </div>

            {/* Phone */}
            <div className="mt-4">

              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                inputMode="numeric"
                className={inputClass}
              />

            </div>

            {/* Address */}
            <div className="mt-4">

              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Address
              </label>

              <textarea
                rows="4"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
              />

            </div>

            {/* Save Button */}
            <div className="mt-6">

              <button
                onClick={handleSubmit}
                className="w-full cursor-pointer rounded bg-accent py-2.5 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2.5 hover:bg-secondary"
              >
                <FaSave className="text-xs" />
                Save Changes
              </button>

            </div>

          </div>

          {/* Security */}
          <div className="rounded-md border border-slate-900/10 bg-white p-6">

            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-6">
              Change Password
            </h2>

            {/* Current Password */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Current Password
              </label>

              <div className="relative">

                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChangeInput}
                  className={`${inputClass} pr-11`}
                />

                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-accent"
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

              </div>

            </div>

            {/* New Password */}
            <div className="mt-4">

              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                New Password
              </label>

              <div className="relative">

                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChangeInput}
                  placeholder="Enter new password"
                  className={`${inputClass} pr-11`}
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-accent"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

              </div>

            </div>

            {/* Confirm Password */}
            <div className="mt-4">

              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirm New Password
              </label>

              <div className="relative">

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChangeInput}
                  placeholder="Confirm new password"
                  className={`${inputClass} pr-11`}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-accent"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

              </div>

            </div>

            {/* Password Requirements */}
            <div className="mt-5 rounded border border-slate-900/10 bg-slate-50 p-4">

              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                To create a better password, follow these
              </h3>

              <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
                <li>Use minimum 8 characters</li>
                <li>Use at least one uppercase letter</li>
                <li>Use at least one lowercase letter</li>
                <li>Use at least one number</li>
                <li>Use at least one special character</li>
              </ul>

            </div>

            {/* Update Password Button */}
            <div className="mt-6">

              <button
                onClick={handlePasswordSubmit}
                className="w-full cursor-pointer rounded bg-secondary py-2.5 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2.5 hover:bg-slate-800"
              >
                <FaLock className="text-xs" />
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