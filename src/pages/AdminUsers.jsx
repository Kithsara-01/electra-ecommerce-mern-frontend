import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaSearch,
  FaUsers,
  FaLock,
  FaLockOpen,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
} from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import AdminLayout from "../components/AdminLayout";
import {getAllUsers, blockUser, unblockUser} from "../services/userService";

function AdminUsers() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState(
    searchParams.get("role") || "all"
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await getAllUsers({
        search: searchTerm,
        role: roleFilter,
        status: statusFilter,
        page: currentPage,
      });

      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setTotalUsers(data.totalUsers || 0);
    } catch (error) {
      console.error("Fetch Users Error:", error);
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (user) => {
    const result = await Swal.fire({
      title: user.isBlocked ? "Unblock User?" : "Block User?",
      text: user.isBlocked
        ? `Are you sure you want to unblock ${user.name}?`
        : `Are you sure you want to block ${user.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: user.isBlocked ? "#2FA084" : "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: user.isBlocked
        ? "Yes, Unblock"
        : "Yes, Block",
    });

    if (!result.isConfirmed) return;

    try {
      if (user.isBlocked) {
        await unblockUser(user._id);

        Swal.fire({
          icon: "success",
          title: "User Unblocked",
          text: `${user.name} has been unblocked successfully.`,
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        await blockUser(user._id);

        Swal.fire({
          icon: "success",
          title: "User Blocked",
          text: `${user.name} has been blocked successfully.`,
          timer: 1800,
          showConfirmButton: false,
        });
      }

      fetchUsers();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  useEffect(() => {
    const role = searchParams.get("role");

    if (role) {
      setRoleFilter(role);
      setCurrentPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter, statusFilter, currentPage]);

  const hasActiveFilters =
    searchTerm || roleFilter !== "all" || statusFilter !== "all";

  const resetFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const selectClass =
    "rounded border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-accent";

  return (
    <AdminLayout title="Users">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-black">
          <b><i>● View, search and manage all registered users.</i></b>
        </p>
      </div>

      {/* Search & Filter */}
      <div className="mt-6 rounded-md border border-slate-200 bg-white p-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400" />

            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-accent"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={selectClass}
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Customer">Customer</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={selectClass}
          >
            <option value="all">All Users</option>
            <option value="active">Active Users</option>
            <option value="blocked">Blocked Users</option>
          </select>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
            <button
              onClick={resetFilters}
              className="cursor-pointer text-sm font-medium text-accent transition-colors hover:text-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="mt-6 overflow-hidden rounded-md border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Profile</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-slate-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                        <FaUsers className="text-2xl text-accent" />
                      </div>

                      <h3 className="text-lg font-bold text-slate-900">
                        No Users Found
                      </h3>

                      <p className="mt-2 text-sm text-slate-500">
                        Registered users will appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-slate-100 transition-colors last:border-none hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-900">
                        {user.name}
                      </div>

                      <div
                        className={`mt-1 inline-block rounded px-2 py-0.5 text-xs font-medium ${
                          user.role === "Admin"
                            ? "bg-accent/10 text-accent"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {user.role}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.email}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.phone || "-"}
                    </td>

                    <td className="px-6 py-4">
                      {user.isBlocked ? (
                        <span className="rounded bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                          Blocked
                        </span>
                      ) : (
                        <span className="rounded bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/users/${user._id}`)}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded bg-accent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-secondary"
                        >
                          <FaEye className="text-xs" />
                          Details
                        </button>

                        <button
                          onClick={() => handleToggleBlock(user)}
                          disabled={user.role === "Admin"}
                          className={`inline-flex cursor-pointer items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium text-white transition-colors ${
                            user.isBlocked
                              ? "bg-accent hover:bg-secondary"
                              : "bg-rose-600 hover:bg-rose-700"
                          } disabled:cursor-not-allowed disabled:bg-slate-300`}
                        >
                          {user.isBlocked ? (
                            <>
                              <FaLockOpen className="text-xs" />
                              Unblock
                            </>
                          ) : (
                            <>
                              <FaLock className="text-xs" />
                              Block
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && users.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row">
            <p className="text-sm text-slate-500">
              Showing page {currentPage} of {totalPages} &middot; {totalUsers} total users
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex cursor-pointer items-center gap-1 rounded border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:border-slate-200 disabled:hover:text-slate-400"
              >
                <FaChevronLeft className="text-xs" />
                Previous
              </button>

              <span className="px-2 text-sm font-medium text-slate-700">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="inline-flex cursor-pointer items-center gap-1 rounded border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:border-slate-200 disabled:hover:text-slate-400"
              >
                Next
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminUsers;