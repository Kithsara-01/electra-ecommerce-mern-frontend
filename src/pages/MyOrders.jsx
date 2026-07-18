import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

import Header from "../components/Header";
import { getMyOrders, cancelOrder } from "../services/orderService";
import { FaFileInvoice, FaDownload } from "react-icons/fa6";
import { downloadInvoice } from "../utils/invoiceGenerator";

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyOrders();
      setOrders(response.orders || []);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load your orders";
      setError(message);
      await Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
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

  const handleCancelOrder = async (orderId) => {
    const result = await Swal.fire({
      title: "Cancel Order?",
      text: "Are you sure you want to cancel this order? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel Order",
      cancelButtonText: "Keep Order",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setCancellingOrderId(orderId);

      await cancelOrder(orderId);

      await Swal.fire({
        title: "Order Cancelled",
        text: "Your order has been cancelled successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      await fetchOrders();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to cancel order";
      await Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setCancellingOrderId(null);
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  // Status badges: accent for the positive/delivered state, rose for cancelled,
  // neutral slate for everything still in progress.
  const statusStyles = {
    Pending: "bg-slate-100 text-slate-700",
    Processing: "bg-slate-100 text-slate-700",
    Shipped: "bg-slate-100 text-slate-700",
    Delivered: "bg-accent/10 text-accent",
    Cancelled: "bg-rose-50 text-rose-700",
  };

  const handleImageError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src =
      "https://placehold.co/80x80/FFFFFF/94A3B8?text=No+Image";
  };

  if (loading) {
    return (
      <>
        <Header showSearch={false} />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded border border-slate-200 bg-white p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <svg
                className="h-8 w-8 animate-spin text-accent"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Loading your orders</h2>
            <p className="mt-2 text-sm text-slate-500">Please wait while we fetch your recent purchases.</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header showSearch={false} />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded border border-rose-200 bg-rose-50 p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <svg
                className="h-8 w-8 text-rose-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">We could not load your orders</h2>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
          </div>
        </div>
      </>
    );
  }

  if (sortedOrders.length === 0) {
    return (
      <>
        <Header showSearch={false} />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded border border-slate-200 bg-white p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <svg
                className="h-8 w-8 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">No orders yet</h2>
            <p className="mt-2 text-sm text-slate-500">
              Your order history will appear here once you place your first purchase.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header showSearch={false} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              My Orders
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Order History
            </h1>
          </div>
          <div className="rounded border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
            {sortedOrders.length} {sortedOrders.length === 1 ? "Order" : "Orders"}
          </div>
        </div>

        <div className="space-y-4">
          {sortedOrders.map((order) => {
            const orderStatus = order.orderStatus || "Pending";
            const statusClass = statusStyles[orderStatus] || "bg-slate-100 text-slate-700";

            return (
              <div
                key={order._id}
                className="rounded border border-slate-200 bg-white p-4 transition-colors hover:border-accent"
              >
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-base font-semibold text-slate-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </h3>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                      >
                        {orderStatus}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <div>
                        <span className="font-medium text-slate-700">Order Date :</span>{" "}
                        {formatDate(order.createdAt)}
                      </div>

                      <div>
                        <span className="font-medium text-slate-700">Payment :</span>{" "}
                        {order.paymentMethod}
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => navigate(`/my-orders/${order._id}`)}
                      className="cursor-pointer rounded-md border border-accent bg-white px-4 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
                    >
                      View Details
                    </button>

                    {orderStatus === "Delivered" && (
                      <button
                        onClick={() => downloadInvoice(order)}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-accent bg-white px-4 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
                      >
                        <FaDownload className="text-xs" />
                        Download Invoice
                      </button>
                    )}

                    {(orderStatus === "Pending" || orderStatus === "Processing") && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingOrderId === order._id}
                        className="cursor-pointer rounded-md bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        {cancellingOrderId === order._id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Delivery Address
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      {order.deliveryAddress || "No address provided"}
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {order.items?.map((item, index) => (
                      <div
                        key={`${order._id}-${index}`}
                        className="flex items-center gap-4 py-3"
                      >
                        <img
                          src={
                            item.image ||
                            "https://placehold.co/80x80/FFFFFF/2FA084?text=Product"
                          }
                          alt={item.name}
                          loading="lazy"
                          onError={handleImageError}
                          className="h-16 w-16 rounded border border-slate-200 bg-white object-contain p-1"
                        />

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-semibold text-slate-900">
                            {item.name}
                          </h3>

                          <div className="mt-1 flex flex-wrap gap-4 text-sm text-slate-500">
                            <span>
                              Qty <strong className="text-slate-700">{item.quantity}</strong>
                            </span>
                            <span>{formatPrice(item.price)}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Total
                          </p>
                          <p className="text-sm font-semibold text-accent">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default MyOrders;
