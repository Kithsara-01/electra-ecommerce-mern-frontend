import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaLocationDot,
  FaUserShield,
  FaCalendarDays,
  FaCircleCheck,
  FaCircleXmark,
} from "react-icons/fa6";

import AdminLayout from "../components/AdminLayout";
import {
  getUserById,
  blockUser,
  unblockUser,
} from "../services/userService";

function AdminUserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);

  const loadUser = async () => {
    try {
      setLoading(true);

      const data = await getUserById(id);

      setUser(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load user details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [id]);

  const handleToggleBlock = async () => {
    const result = await Swal.fire({
            title: user.isBlocked ? "Unblock User?" : "Block User?",
            text: user.isBlocked
            ? "This user will be able to access the system again."
            : "This user will no longer be able to access the system.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: user.isBlocked ? "#2FA084" : "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: user.isBlocked
            ? "Yes, Unblock"
            : "Yes, Block",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        try {
            if (user.isBlocked) {
            await unblockUser(user._id);

            Swal.fire({
                icon: "success",
                title: "User Unblocked",
                text: "The user has been unblocked successfully.",
                timer: 1800,
                showConfirmButton: false,
            });
            } else {
            await blockUser(user._id);

            Swal.fire({
                icon: "success",
                title: "User Blocked",
                text: "The user has been blocked successfully.",
                timer: 1800,
                showConfirmButton: false,
            });
            }

            loadUser();
        } catch (error) {
            console.error(error);

            Swal.fire({
            icon: "error",
            title: "Operation Failed",
            text: "Something went wrong. Please try again.",
            });
        }
    };
    if (loading) {
    return (
      <AdminLayout title="User Details">
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-slate-500">Loading user details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout title="User Details">
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-rose-600">User not found.</p>
        </div>
      </AdminLayout>
    );
  }

  const fieldBox =
    "rounded border border-slate-200 p-3 text-sm text-slate-900";

  return (
    <AdminLayout title="User Details">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">

          <button
            onClick={() => navigate("/admin/users")}
            className="inline-flex cursor-pointer items-center gap-2 rounded border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-accent hover:text-accent"
          >
            <FaArrowLeft className="text-xs" />
            Back
          </button>

        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Profile Card */}
          <div className="rounded-md border border-slate-200 bg-white p-6">

            <div className="flex flex-col items-center">

              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="h-28 w-28 rounded-full border-2 border-accent object-cover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-100 text-4xl font-bold text-slate-600">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                {user.name}
              </h2>

              <span
                className={`mt-3 rounded px-3 py-1 text-xs font-semibold ${
                  user.role === "Admin"
                    ? "bg-accent/10 text-accent"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {user.role}
              </span>

              <span
                className={`mt-2 rounded px-3 py-1 text-xs font-semibold ${
                  user.isBlocked
                    ? "bg-rose-50 text-rose-700"
                    : "bg-accent/10 text-accent"
                }`}
              >
                {user.isBlocked ? "Blocked" : "Active"}
              </span>

            </div>

          </div>

          {/* Right Side */}
          <div className="space-y-6 lg:col-span-2">

            {/* Personal Information */}
            <div className="rounded-md border border-slate-200 bg-white p-6">

              <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>
                  <p className="mb-1.5 text-sm font-medium text-slate-500">
                    Full Name
                  </p>

                  <div className={`${fieldBox} font-semibold`}>
                    {user.name}
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-500">
                    <FaEnvelope className="text-xs" />
                    Email
                  </p>

                  <div className={fieldBox}>
                    {user.email}
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-500">
                    <FaPhone className="text-xs" />
                    Phone
                  </p>

                  <div className={fieldBox}>
                    {user.phone || "-"}
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-500">
                    <FaLocationDot className="text-xs" />
                    Address
                  </p>

                  <div className={fieldBox}>
                    {user.address || "-"}
                  </div>
                </div>

              </div>

            </div>

            {/* Account Information */}
            <div className="rounded-md border border-slate-200 bg-white p-6">

              <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Account Information
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>
                  <p className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-500">
                    <FaUserShield className="text-xs" />
                    Role
                  </p>

                  <div className={fieldBox}>
                    {user.role}
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 text-sm font-medium text-slate-500">
                    Status
                  </p>

                  <div className={fieldBox}>
                    {user.isBlocked ? (
                      <span className="flex items-center gap-2 font-semibold text-rose-700">
                        <FaCircleXmark className="text-xs" />
                        Blocked
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 font-semibold text-accent">
                        <FaCircleCheck className="text-xs" />
                        Active
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-500">
                    <FaCalendarDays className="text-xs" />
                    Joined Date
                  </p>

                  <div className={fieldBox}>
                    {new Date(user.createdAt).toLocaleDateString("en-LK")}
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-500">
                    <FaCalendarDays className="text-xs" />
                    Last Updated
                  </p>

                  <div className={fieldBox}>
                    {new Date(user.updatedAt).toLocaleDateString("en-LK")}
                  </div>
                </div>

              </div>

            </div>

            {/* Actions */}
            <div className="rounded-md border border-slate-200 bg-white p-6">

              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Quick Actions
              </h2>

              <div className="flex flex-wrap gap-3">

                <button
                  onClick={handleToggleBlock}
                  disabled={user.role === "Admin"}
                  className={`cursor-pointer rounded px-5 py-2.5 text-sm font-semibold text-white transition-colors ${
                    user.isBlocked
                      ? "bg-accent hover:bg-secondary"
                      : "bg-rose-600 hover:bg-rose-700"
                  } disabled:cursor-not-allowed disabled:bg-slate-300`}
                >
                  {user.isBlocked ? "Unblock User" : "Block User"}
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </AdminLayout>
  );
}

export default AdminUserDetails;