import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import defaultProfile from "../assets/default-profile.png";

function AdminProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not Available";

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center p-6 border-b border-gray-200">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="w-11 h-11 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
          >
            <FaArrowLeft className="text-xl text-secondary" />
          </button>

          <h2 className="flex-1 text-center text-2xl font-bold text-secondary mr-11">
            Admin Profile
          </h2>
        </div>

        <div className="flex flex-col items-center p-8">
          <img
            src={user?.profileImage || defaultProfile}
            alt="Admin Profile"
            className="w-32 h-32 rounded-full border-4 border-accent object-cover"
          />

          <h1 className="mt-5 text-3xl font-bold text-secondary">
            {user?.name || "Admin"}
          </h1>

          <p className="mt-2 text-gray-500">{user?.email}</p>
        </div>

        <hr className="border-gray-200" />

        <div className="p-8">
          <div className="flex justify-between py-5 border-b border-gray-200">
            <span className="font-semibold text-secondary">Name</span>
            <span className="text-gray-600">{user?.name || "Admin"}</span>
          </div>

          <div className="flex justify-between py-5 border-b border-gray-200">
            <span className="font-semibold text-secondary">Email</span>
            <span className="text-gray-600">{user?.email || "Not Added"}</span>
          </div>

          <div className="flex justify-between py-5 border-b border-gray-200">
            <span className="font-semibold text-secondary">Phone</span>
            <span className="text-gray-600">{user?.phone || "Not Added"}</span>
          </div>

          <div className="flex justify-between py-5 border-b border-gray-200">
            <span className="font-semibold text-secondary">Address</span>
            <span className="text-gray-600">{user?.address || "Not Added"}</span>
          </div>

          <div className="flex justify-between py-5 border-b border-gray-200">
            <span className="font-semibold text-secondary">Role</span>
            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
              {user?.role || "Admin"}
            </span>
          </div>

          <div className="flex justify-between py-5">
            <span className="font-semibold text-secondary">Joined</span>
            <span className="text-gray-600">{joinedDate}</span>
          </div>
        </div>

        <div className="p-8 pt-0">
          <button
            onClick={() => navigate("/admin/edit-profile")}
            className="w-full bg-accent hover:opacity-90 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-3 transition"
          >
            <FaEdit />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;