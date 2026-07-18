import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import defaultProfile from "../assets/default-profile.png";

function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-6 py-10">
      <div className="w-full max-w-2xl rounded border border-slate-200 bg-white overflow-hidden">

        {/* Header */}
        <div className="flex items-center border-b border-black/10 p-6">

          <button
            onClick={() => navigate("/")}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition-colors hover:border-accent hover:text-accent"
          >
            <FaArrowLeft />
          </button>

          <h2 className="mr-10 flex-1 text-center text-xl font-bold text-slate-900">
            My Profile
          </h2>

        </div>

        {/* Profile Top */}
        <div className="flex flex-col items-center p-8">

          <img
            src={user?.profileImage || defaultProfile}
            alt="Profile"
            className="h-28 w-28 rounded-full border-4 border-accent object-cover"
          />

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            {user?.name}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {user?.email}
          </p>

        </div>

        <hr className="border-black/10" />

        {/* Details */}
        <div className="p-8">

          <div className="flex justify-between border-b border-black/10 py-4">
            <span className="text-sm font-semibold text-slate-900">
              Name
            </span>

            <span className="text-sm text-slate-700">
              {user?.name}
            </span>
          </div>

          <div className="flex justify-between border-b border-black/10 py-4">
            <span className="text-sm font-semibold text-slate-900">
              Email
            </span>

            <span className="text-sm text-slate-700">
              {user?.email}
            </span>
          </div>

          <div className="flex justify-between border-b border-black/10 py-4">
            <span className="text-sm font-semibold text-slate-900">
              Phone
            </span>

            <span className="text-sm text-slate-700">
              {user?.phone || "Not Added"}
            </span>
          </div>

          <div className="flex justify-between border-b border-black/10 py-4">
            <span className="text-sm font-semibold text-slate-900">
              Address
            </span>

            <span className="text-sm text-slate-700">
              {user?.address || "Not Added"}
            </span>
          </div>

          <div className="flex justify-between py-4">
            <span className="text-sm font-semibold text-slate-900">
              Role
            </span>

            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              {user?.role}
            </span>
          </div>

        </div>

        {/* Bottom Button */}
        <div className="p-8 pt-0">

          <button
            onClick={() => navigate("/edit-profile")}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary"
          >
            <FaEdit />
            Edit Profile
          </button>

        </div>

      </div>
    </div>
  );
}

export default Profile;