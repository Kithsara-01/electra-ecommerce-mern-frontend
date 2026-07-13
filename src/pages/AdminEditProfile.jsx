import {/////////////
  updateMyProfile,
  changePassword,
  getMyProfile,
} from "../services/authService"; ////////

import { supabase } from "../services/supabase";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
// import { updateMyProfile, changePassword } from "../services/authService";

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

  return (
    <div className="min-h-screen bg-primary px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate("/admin/profile")}
            className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-md hover:bg-gray-50 hover:shadow-lg transition duration-300"
          >
            <FaArrowLeft className="text-secondary" />
            <span className="font-semibold text-secondary">Back</span>
          </button>

          <h1 className="text-3xl font-bold text-secondary">Edit Profile</h1>
          <div className="w-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-secondary mb-8">Personal Information</h2>
            <div className="flex flex-col items-center mb-8">
              <img
                src={previewImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-accent"
              />

              <label className="mt-4 cursor-pointer bg-accent text-white px-5 py-2 rounded-lg hover:opacity-90 transition">
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
              <label className="block text-sm font-semibold text-secondary mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-secondary mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-secondary mb-2">Phone Number</label>
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

            <div className="mt-6">
              <label className="block text-sm font-semibold text-secondary mb-2">Address</label>
              <textarea
                rows="4"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-accent text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-teal-700 transition duration-300"
              >
                <FaSave />
                Save Changes
              </button>

              <button
                onClick={() => navigate("/admin/profile")}
                className="flex-1 bg-white border border-gray-300 text-secondary py-3 rounded-xl font-semibold hover:bg-gray-50 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-secondary mb-8">Change Password</h2>

            <div>
              <label className="block text-sm font-semibold text-secondary mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-secondary mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-secondary mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-primary/40 border border-accent/20 p-4 flex items-start gap-3">
              <FaLock className="text-accent mt-1" />
              <p className="text-sm text-gray-600">
                Update your password here. Leave the password fields empty if you do not want to change it.
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={handlePasswordSubmit}
                className="w-full bg-secondary text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition duration-300"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminEditProfile;