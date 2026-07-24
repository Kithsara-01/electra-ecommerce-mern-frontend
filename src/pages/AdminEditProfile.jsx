import {
  updateMyProfile,
  changePassword,
  getMyProfile,
} from "../services/authService";

import { supabase } from "../services/supabase";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import defaultProfile from "../assets/default-profile.png";

import {
  FaArrowLeft,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaLock,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

function AdminEditProfile() {
  const navigate = useNavigate();
  const { user, loadUser, logout } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setPreviewImage(user.profileImage || defaultProfile);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(
        user?.profileImage || defaultProfile
      );

  const handleChange = (e) => {
      const { name, value } = e.target;

      const safeValue =
        name === "phone"
          ? value.replace(/\D/g, "").slice(0, 10)
          : value;

      setFormData((prev) => ({
        ...prev,
        [name]: safeValue,
      }));
    };

    const handleImageChange = (e) => {
      const file = e.target.files[0];

      if (!file) return;

      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    };

    


  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };



  const handleSubmit = async (e) => {
      e.preventDefault();

      const oldImage = user?.profileImage;

      try {
        let imageUrl = user?.profileImage || "";

        // Upload new image if selected
        if (selectedImage) {
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

        console.log("Sending:", {
          ...formData,
          profileImage: imageUrl,
        });

        const response = await updateMyProfile({
          ...formData,
          profileImage: imageUrl,
        });

        // Delete old image from Supabase
        if (
          selectedImage &&
          oldImage &&
          oldImage.includes("/storage/v1/object/public/images/")
        ) {
          const oldFileName = oldImage.split("/images/")[1];

          const { error: deleteError } = await supabase.storage
            .from("images")
            .remove([oldFileName]);

          if (deleteError) {
            console.error("Delete Error:", deleteError);
          } else {
            console.log("Old image deleted successfully");
          }
        }

        await loadUser();

        const latest = await getMyProfile();
        console.log("Database returned:", latest.user.profileImage);

        toast.success(response.message || "Profile updated successfully");

        navigate("/admin/profile");

      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data?.message ||
          error.message ||
          "Failed to update profile"
        );
      }
    };


// handle password submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      const response = await changePassword(passwordData);

      toast.success(
        response.message || "Password updated successfully"
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      await logout();

      navigate("/login");

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Failed to change password"
      );

    }
  };

  const inputClass =
    "w-full rounded border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-accent";

  return (
    <>
      <Header showSearch={false} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">

          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => navigate("/admin/profile")}
              className="flex cursor-pointer items-center gap-2.5 rounded border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-accent hover:text-accent"
            >
              <FaArrowLeft className="text-xs" />
              <span>Back</span>
            </button>

            <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>

            <div className="w-20" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* Personal Information */}
            <div className="rounded-md border border-slate-200 bg-white p-6">
              <h2 className="mb-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Personal Information
              </h2>

              <div className="flex flex-col items-center mb-7">
                <img
                  src={previewImage}
                  alt="Profile"
                  className="h-28 w-28 rounded-full border-2 border-accent object-cover"
                />

                <label className="mt-4 cursor-pointer rounded bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary">
                  Choose Image

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone Number</label>
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

              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Address</label>
                <textarea
                  rows="4"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSubmit}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2.5 rounded bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary"
                >
                  <FaSave className="text-xs" />
                  Save Changes
                </button>

                <button
                  onClick={() => navigate("/admin/profile")}
                  className="flex-1 cursor-pointer rounded border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-accent hover:text-accent"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Change Password */}
            <div className="rounded-md border border-slate-200 bg-white p-6">
              <h2 className="mb-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Change Password
              </h2>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-accent"
                  >
                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-accent"
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-accent"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded border border-accent/20 bg-accent/5 p-4">
                <FaLock className="mt-0.5 text-sm text-accent" />
                <p className="text-sm text-slate-600">
                  Update your password here. Leave the password fields empty if you do not want to change it.
                </p>
              </div>

              <div className="mt-6">
                <button
                  onClick={handlePasswordSubmit}
                  className="w-full cursor-pointer rounded bg-secondary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Update Password
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default AdminEditProfile;