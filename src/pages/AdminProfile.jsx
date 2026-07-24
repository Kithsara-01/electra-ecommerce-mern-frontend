import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit } from "react-icons/fa";

import Header from "../components/Header";
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

  const infoRows = [
    { label: "Name", value: user?.name || "Admin" },
    { label: "Email", value: user?.email || "Not Added" },
    { label: "Phone", value: user?.phone || "Not Added" },
    { label: "Address", value: user?.address || "Not Added" },
  ];

  return (
    <>
      <Header showSearch={false} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-100">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-md border border-slate-200 bg-white">

            {/* Header */}
            <div className="flex items-center border-b border-slate-100 p-5">
              <button
                onClick={() => navigate("/admin-dashboard")}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded transition-colors hover:bg-slate-100"
              >
                <FaArrowLeft className="text-sm text-slate-700" />
              </button>

              <h2 className="mr-9 flex-1 text-center text-lg font-bold text-slate-900">
                Admin Profile
              </h2>
            </div>

            {/* Profile */}
            <div className="flex flex-col items-center p-8">
              <img
                src={user?.profileImage || defaultProfile}
                alt="Admin Profile"
                className="h-28 w-28 rounded-full border-2 border-accent object-cover"
              />

              <h1 className="mt-4 text-2xl font-bold text-slate-900">
                {user?.name || "Admin"}
              </h1>

              <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
            </div>

            <hr className="border-slate-100" />

            {/* Info */}
            <div className="p-8">
              {infoRows.map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between border-b border-slate-100 py-4 last:border-none"
                >
                  <span className="text-sm font-semibold text-slate-900">
                    {row.label}
                  </span>
                  <span className="text-sm text-slate-600">{row.value}</span>
                </div>
              ))}

              <div className="flex justify-between border-t border-slate-100 py-4">
                <span className="text-sm font-semibold text-slate-900">Role</span>
                <span className="rounded bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                  {user?.role || "Admin"}
                </span>
              </div>

              <div className="flex justify-between border-t border-slate-100 py-4">
                <span className="text-sm font-semibold text-slate-900">Joined</span>
                <span className="text-sm text-slate-600">{joinedDate}</span>
              </div>
            </div>

            {/* Edit Button */}
            <div className="p-8 pt-0">
              <button
                onClick={() => navigate("/admin/edit-profile")}
                className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary"
              >
                <FaEdit className="text-xs" />
                Edit Profile
              </button>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default AdminProfile;