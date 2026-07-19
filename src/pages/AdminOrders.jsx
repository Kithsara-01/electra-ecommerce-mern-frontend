import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

import AdminLayout from "../components/AdminLayout";
import { getAllOrders, updateOrderStatus } from "../services/orderService";
import { FaSearch } from "react-icons/fa";

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
      confirmButtonColor: "#f59e0b",
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

  if (loading) {
    return (
      <AdminLayout title="Admin Orders">
        <div className="rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
            <svg className="h-7 w-7 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-secondary">Loading orders...</h2>
          <p className="mt-2 text-sm text-slate-600">Please wait while we fetch the latest orders.</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Admin Orders">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-secondary">Unable to load orders</h2>
          <p className="mt-2 text-sm text-slate-600">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  

  return (
    <AdminLayout title="Admin Orders">
      <div className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          
          <div>
            <h2 className="text-2xl font-semibold text-secondary">Order Management</h2>
            <p className="mt-1 text-sm text-slate-600">Track and update customer orders in real time.</p>
          </div>
          <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
            {totalOrders} orders
          </span>
        </div>
        <div className="relative mb-5">
          {pendingOrdersCount > 0 && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm font-medium text-amber-700">
              ⚠ {pendingOrdersCount} pending order
              {pendingOrdersCount > 1 ? "s require" : " requires"} attention.
            </p>
          </div>
        )}

          <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search by customer, email, phone or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />

        </div>



        <div className="mb-6 flex flex-wrap gap-3">
            {FILTERS.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedFilter(status)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  selectedFilter === status
                    ? "border-accent bg-accent text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-accent hover:text-accent"
                }`}
              >
                {status} ({getStatusCount(status)})
              </button>
            ))}
          </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Action</th>
              </tr>
            </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {sortedOrders.length > 0 ? (
              sortedOrders.map((order) => {
                const currentStatus = order.orderStatus || "Pending";
                const allowedStatuses = getAllowedStatuses(currentStatus);

                return (
                  <tr
                    key={order._id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-900">
                      #{order._id?.slice(-8).toUpperCase()}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {currentStatus === "Pending" && (
                          <span
                            className="h-2.5 w-2.5 rounded-full bg-red-500 flex-shrink-0"
                            title="Pending Order"
                          ></span>
                        )}

                        <span className="text-sm text-slate-700">
                          {order.customerName || "N/A"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-700">
                      {order.email || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-700">
                      {order.phone || "N/A"}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-accent">
                      {formatPrice(order.grandTotal || order.totalAmount)}
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
                        className={`rounded-lg border px-3 py-2 text-sm font-semibold shadow-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-70 ${
                          currentStatus === "Pending"
                            ? "border-amber-300 bg-amber-50 text-amber-700 focus:border-amber-400 focus:ring-amber-200"
                            : currentStatus === "Processing"
                            ? "border-blue-300 bg-blue-50 text-blue-700 focus:border-blue-400 focus:ring-blue-200"
                            : currentStatus === "Shipped"
                            ? "border-indigo-300 bg-indigo-50 text-indigo-700 focus:border-indigo-400 focus:ring-indigo-200"
                            : currentStatus === "Delivered"
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700 focus:border-emerald-400 focus:ring-emerald-200"
                            : "border-rose-300 bg-rose-50 text-rose-700 focus:border-rose-400 focus:ring-rose-200"
                        }`}
                      >
                        {allowedStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-700">
                      <button
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        className="inline-flex items-center rounded-lg bg-accent/10 px-3 py-2 text-sm font-medium text-accent transition hover:bg-accent/20"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  No matching orders found.
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <p className="text-sm text-slate-600">
            Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-secondary transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminOrders;
