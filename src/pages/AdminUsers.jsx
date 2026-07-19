import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaUsers, FaLock, FaLockOpen, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import AdminLayout from "../components/AdminLayout";
import {getAllUsers, blockUser, unblockUser} from "../services/userService";

function AdminUsers() {
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
      confirmButtonColor: user.isBlocked ? "#16a34a" : "#dc2626",
      cancelButtonColor: "#6b7280",
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

  return (
    <AdminLayout title="Users">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-secondary">
          User Management
        </h2>

        <p className="text-gray-600">
          View, search and manage all registered customers.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="mt-8 rounded-3xl bg-white p-6 shadow-xl">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
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
            className="rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Users</option>
            <option value="active">Active Users</option>
            <option value="blocked">Blocked Users</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">Profile</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Phone</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary">
                        <FaUsers className="text-4xl text-accent" />
                      </div>

                      <h3 className="text-2xl font-bold text-secondary">
                        No Users Found
                      </h3>

                      <p className="mt-3 text-gray-500">
                        Registered users will appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="h-12 w-12 rounded-full border border-gray-300 object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-700">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                    <div className="font-semibold text-secondary">
                      {user.name}
                    </div>

                    <div
                      className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-medium ${
                        user.role === "Admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role}
                    </div>
                  </td>

                    <td className="px-6 py-4">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">
                      {user.phone || "-"}
                    </td>

                    <td className="px-6 py-4">
                      {user.isBlocked ? (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                          Blocked
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleBlock(user)}
                        disabled={user.role === "Admin"}
                        className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-white transition ${
                          user.isBlocked
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        } disabled:cursor-not-allowed disabled:bg-gray-400`}
                      >
                        {user.isBlocked ? (
                          <>
                            <FaLockOpen />
                            Unblock
                          </>
                        ) : (
                          <>
                            <FaLock />
                            Block
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && users.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-6 py-4 sm:flex-row">
            <p className="text-sm text-gray-500">
              Showing page {currentPage} of {totalPages} &middot; {totalUsers} total users
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaChevronLeft className="text-xs" />
                Previous
              </button>

              <span className="px-2 text-sm font-medium text-gray-700">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
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