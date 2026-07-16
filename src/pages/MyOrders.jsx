import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

import Header from "../components/Header";
import { getMyOrders, cancelOrder } from "../services/orderService";

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

  const statusStyles = {
    Pending: "bg-amber-50 text-amber-700",
    Processing: "bg-blue-50 text-blue-700",
    Shipped: "bg-indigo-50 text-indigo-700",
    Delivered: "bg-emerald-50 text-emerald-700",
    Cancelled: "bg-rose-50 text-rose-700",
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
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
            <h2 className="text-2xl font-semibold text-slate-900">Loading your orders</h2>
            <p className="mt-2 text-slate-600">Please wait while we fetch your recent purchases.</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <svg
                className="h-8 w-8 text-rose-500"
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
            <h2 className="text-2xl font-semibold text-slate-900">We could not load your orders</h2>
            <p className="mt-2 text-slate-600">{error}</p>
          </div>
        </div>
      </>
    );
  }

  if (sortedOrders.length === 0) {
    return (
      <>
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
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
            <h2 className="text-2xl font-semibold text-slate-900">No orders yet</h2>
            <p className="mt-2 text-slate-600">
              Your order history will appear here once you place your first purchase.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
              My Orders
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Order History
            </h1>
          </div>
          <p className="text-sm text-slate-600">
            {sortedOrders.length} {sortedOrders.length === 1 ? "order" : "orders"} found
          </p>
        </div>

        <div className="space-y-6">
          {sortedOrders.map((order) => {
            const orderStatus = order.orderStatus || "Pending";
            const statusClass = statusStyles[orderStatus] || "bg-slate-100 text-slate-700";

            return (
              <div
                key={order._id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Order ID</p>
                    <p className="mt-1 font-semibold text-slate-900">#{order._id?.slice(-8).toUpperCase()}</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Status</p>
                      <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusClass}`}>
                        {orderStatus}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/my-orders/${order._id}`)}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      View Details
                    </button>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Order Date</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    {(orderStatus === "Pending" || orderStatus === "Processing") && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingOrderId === order._id}
                        className="inline-flex items-center justify-center rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600 disabled:bg-rose-300"
                      >
                        {cancellingOrderId === order._id ? (
                          <>
                            <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Cancelling...
                          </>
                        ) : (
                          "Cancel Order"
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Delivery Address</p>
                      <p className="mt-1 text-sm text-slate-700">{order.deliveryAddress || "No address provided"}</p>
                    </div>

                    <div className="space-y-3">
                      {order.items?.map((item, index) => (
                        <div
                          key={`${order._id}-${index}`}
                          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center"
                        >
                          <div className="h-20 w-20 overflow-hidden rounded-xl bg-white">
                            <img
                              src={item.image || "https://placehold.co/96x96/E6F6F1/2FA084?text=Product"}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">{item.name}</h3>
                            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                              <span>Qty: {item.quantity}</span>
                              <span>Price: {formatPrice(item.price)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-500">Total Amount</p>
                    <p className="mt-2 text-2xl font-semibold text-accent">
                      {formatPrice(order.totalAmount)}
                    </p>
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
