import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

import AdminLayout from "../components/AdminLayout";
import { getAllOrders, updateOrderStatus } from "../services/orderService";
import {
  FaSearch,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaInbox,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
  FaBoxOpen,
} from "react-icons/fa";

function AdminOrders() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(
    searchParams.get("status") || "All"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const status = searchParams.get("status");

    if (status) {
      setSelectedFilter(status);
      setCurrentPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, debouncedSearch, selectedFilter]);

  const fetchOrders = async (page = 1) => {
    try {
      if (initialLoad) {
        setLoading(true);
      } else {
        setIsSearching(true);
      }
      setError("");
      const response = await getAllOrders(
        page,
        10,
        debouncedSearch,
        selectedFilter
      );
      setOrders(response.orders || []);
      setInitialLoad(false);
      setTotalPages(response.totalPages);
      setTotalOrders(response.totalOrders);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load orders";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const statusTransitionMap = {
    Pending: ["Pending", "Processing", "Cancelled"],
    Processing: ["Processing", "Shipped", "Cancelled"],
    Shipped: ["Shipped", "Delivered"],
    Delivered: ["Delivered"],
    Cancelled: ["Cancelled"],
  };

  const getAllowedStatuses = (currentStatus) => {
    return statusTransitionMap[currentStatus] || [currentStatus || "Pending"];
  };

  const isStatusTransitionAllowed = (currentStatus, nextStatus) => {
    const allowedStatuses = getAllowedStatuses(currentStatus);
    return allowedStatuses.includes(nextStatus);
  };

  const handleStatusChange = async (orderId, status, currentStatus) => {
    if (!isStatusTransitionAllowed(currentStatus, status)) {
      toast.error("This status transition is not allowed.");
      return false;
    }

    const result = await Swal.fire({
      title: "Update Order Status?",
      text: `Are you sure you want to change this order status from "${currentStatus}" to "${status}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2FA084",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) {
      return false;
    }

    try {
      setUpdatingId(orderId);
      await updateOrderStatus(orderId, status);
      await fetchOrders(currentPage);
      toast.success("Order status updated successfully");
      return true;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update order status";
      toast.error(message);
      return false;
    } finally {
      setUpdatingId("");
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(price || 0);

  const formatDate = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleDateString("en-LK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const aPending = a.orderStatus === "Pending";
    const bPending = b.orderStatus === "Pending";

    if (aPending && !bPending) return -1;
    if (!aPending && bPending) return 1;

    return 0;
  });

  const FILTERS = [
    "All",
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const getStatusCount = (status) => {
    if (status === "All") return orders.length;

    return orders.filter((order) => order.orderStatus === status).length;
  };

  const pendingOrdersCount = orders.filter(
    (order) => order.orderStatus === "Pending"
  ).length;

  // Status badge styling — flat, border-only, no shadows
  const statusStyles = {
    Pending: "border-amber-200 bg-amber-50 text-amber-700 focus:border-amber-300 focus:ring-amber-100",
    Processing: "border-blue-200 bg-blue-50 text-blue-700 focus:border-blue-300 focus:ring-blue-100",
    Shipped: "border-indigo-200 bg-indigo-50 text-indigo-700 focus:border-indigo-300 focus:ring-indigo-100",
    Delivered: "border-accent/30 bg-accent/10 text-accent focus:border-accent focus:ring-accent/10",
    Cancelled: "border-rose-200 bg-rose-50 text-rose-700 focus:border-rose-300 focus:ring-rose-100",
  };

  if (loading) {
      return (
        <AdminLayout title="Admin Orders">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-accent"></div>

              <p className="text-sm text-slate-600">
                Loading orders...
              </p>
            </div>
          </div>
        </AdminLayout>
      );
    }

  if (error) {
    return (
      <AdminLayout title="Admin Orders">
        <div className="flex min-h-[420px] items-center justify-center rounded-md border border-rose-200 bg-rose-50 p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-rose-100">
              <FaExclamationCircle className="h-6 w-6 text-rose-700" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Unable to load orders</h2>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500">{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Admin Orders">
      <div className="rounded-md border border-slate-200 bg-white p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Order Management</h2>
            <p className="mt-1 text-sm text-slate-500">
              Track, manage and update customer orders in real time.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
            <FaBoxOpen className="h-3.5 w-3.5" aria-hidden="true" />
            {totalOrders} {totalOrders === 1 ? "order" : "orders"}
          </span>
        </div>

        {/* Pending orders alert */}
        {pendingOrdersCount > 0 && (
          <div className="mb-5 flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3.5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-amber-100">
              <FaExclamationTriangle className="h-4 w-4 text-amber-700" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800">
                {pendingOrdersCount} pending order{pendingOrdersCount > 1 ? "s" : ""} require{pendingOrdersCount === 1 ? "s" : ""} attention
              </p>
              <p className="mt-0.5 text-xs text-amber-700/80">
                Review and update their status to keep customers informed.
              </p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-5">
          <FaSearch className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search by customer, email, phone or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition-colors duration-150 placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/10"
            aria-label="Search orders"
          />
          {isSearching && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2">
              <svg className="h-4 w-4 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </span>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {FILTERS.map((status) => {
            const isActive = selectedFilter === status;
            return (
              <button
                key={status}
                onClick={() => setSelectedFilter(status)}
                aria-pressed={isActive}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? "border-accent bg-accent text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-accent/40 hover:text-accent"
                }`}
              >
                {status}
                <span
                  className={`inline-flex min-w-[1.375rem] items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {getStatusCount(status)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Order ID</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Customer</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Phone</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Total</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {sortedOrders.length > 0 ? (
                sortedOrders.map((order) => {
                  const currentStatus = order.orderStatus || "Pending";
                  const allowedStatuses = getAllowedStatuses(currentStatus);

                  return (
                    <tr
                      key={order._id}
                      className="transition-colors duration-150 odd:bg-white even:bg-slate-50/60 hover:bg-accent/5"
                    >
                      <td className="whitespace-nowrap px-4 py-4">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold tracking-tight text-slate-700">
                          #{order.orderCode || order._id?.slice(-8).toUpperCase()}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {currentStatus === "Pending" && (
                            <span
                              className="h-2 w-2 flex-shrink-0 rounded-full bg-rose-600"
                              title="Pending Order"
                            ></span>
                          )}

                          <span className="text-sm font-medium text-slate-900">
                            {order.customerName || "N/A"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-500">
                        {order.email || "N/A"}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-500">
                        {order.phone || "N/A"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <span className="inline-flex items-center rounded-md bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent">
                          {formatPrice(order.grandTotal || order.totalAmount)}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-700">
                        <select
                          value={currentStatus}
                          onChange={async (e) => {
                            if (e.target.value !== currentStatus) {
                              const confirmed = await handleStatusChange(
                                order._id,
                                e.target.value,
                                currentStatus
                              );

                              if (!confirmed) {
                                e.target.value = currentStatus;
                              }
                            }
                          }}
                          disabled={updatingId === order._id}
                          aria-label={`Update status for order ${order._id}`}
                          className={`cursor-pointer rounded-md border px-3.5 py-2 text-sm font-semibold outline-none transition-colors duration-150 focus:ring-2 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-50 disabled:text-slate-400 ${statusStyles[currentStatus]}`}
                        >
                          {allowedStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-500">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-700">
                        <button
                          onClick={() => navigate(`/admin/orders/${order._id}`)}
                          className="group inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-accent bg-white px-3.5 py-2 text-sm font-medium text-accent transition-colors duration-150 hover:bg-accent hover:text-white"
                        >
                          View Details
                          <FaArrowRight className="h-3 w-3" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="mx-auto flex max-w-xs flex-col items-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-slate-100">
                        <FaInbox className="h-6 w-6 text-slate-400" aria-hidden="true" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700">No matching orders found</p>
                      <p className="mt-1 text-xs text-slate-400">Try adjusting your search or filter to find what you're looking for.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col-reverse items-center justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row">
          <p className="text-sm text-slate-500">
            Page <span className="font-semibold text-slate-900">{currentPage}</span> of{" "}
            <span className="font-semibold text-slate-900">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:border-accent/40 hover:text-accent disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:text-slate-400"
            >
              <FaChevronLeft className="h-3 w-3" aria-hidden="true" />
              Previous
            </button>

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-secondary disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              Next
              <FaChevronRight className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminOrders;