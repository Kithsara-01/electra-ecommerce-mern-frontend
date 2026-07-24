import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../components/AdminLayout";
import OrderStatusTracker from "../components/OrderStatusTracker";

import {
  FaArrowLeft,
  FaUser,
  FaMoneyBillWave,
  FaBoxOpen,
  FaCreditCard,
  FaTruck,
  FaInfoCircle,
  FaClipboardList,
  FaTag,
} from "react-icons/fa";

import { getOrderById } from "../services/orderService";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(price || 0);

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const getStatusBadge = (status) => {
  switch (status) {
    case "Pending":
      return "border border-amber-200 bg-amber-50 text-amber-700";
    case "Processing":
      return "border border-blue-200 bg-blue-50 text-blue-700";
    case "Shipped":
      return "border border-indigo-200 bg-indigo-50 text-indigo-700";
    case "Delivered":
      return "border border-accent/30 bg-accent/10 text-accent";
    case "Cancelled":
      return "border border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border border-slate-200 bg-slate-100 text-slate-700";
  }
};

function AdminOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getOrderById(orderId);
      setOrder(response.order);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load order.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Order Details">
        <div className="rounded-md border border-slate-200 bg-white p-12 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Loading Order...</h2>
          <p className="mt-2 text-sm text-slate-500">
            Please wait while we load the order details.
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Order Details">
        <div className="rounded-md border border-rose-200 bg-rose-50 p-12 text-center">
          <h2 className="text-xl font-semibold text-rose-700">{error}</h2>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Order Details">
      <div className="space-y-5">

        {/* ─── 1. ORDER HEADER ─────────────────────────────────────────────────── */}
        <div className="rounded-md border border-slate-200 bg-white p-5">
          {/* Back nav */}
          <div className="mb-5 border-b border-slate-100 pb-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-500 transition-colors duration-150 hover:text-accent"
            >
              <FaArrowLeft className="h-3.5 w-3.5" />
              Back to Orders
            </button>
          </div>

          {/* Order identity row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Order #{order.orderCode || order._id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-sm text-slate-500">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>

            <span
              className={`self-start rounded-full px-4 py-1.5 text-sm font-semibold ${getStatusBadge(
                order.orderStatus
              )}`}
            >
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* ─── 2. ORDER PROGRESS TIMELINE ──────────────────────────────────────── */}
        <div className="rounded-md border border-slate-200 bg-white p-6">
          <div className="mb-6 flex items-center gap-2">
            <FaClipboardList className="h-4 w-4 text-slate-400" />
            <div>
              <h2 className="text-base font-semibold text-slate-900">Order Progress</h2>
              <p className="text-sm text-slate-500">Current delivery status</p>
            </div>
          </div>

          <OrderStatusTracker currentStatus={order.orderStatus} />
        </div>

        {/* ─── 3. ORDER OVERVIEW (SUMMARY CARDS) ───────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* Customer */}
          <div className="rounded-md border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase text-slate-600">
                  Customer
                </p>
                <p className="mt-1.5 truncate text-base font-semibold text-slate-900">
                  {order.customerName}
                </p>
              </div>
              <div className="flex-shrink-0 rounded-md bg-slate-100 p-3 text-slate-500">
                <FaUser size={18} />
              </div>
            </div>
          </div>

          {/* Grand Total — the one figure on this row that earns the accent color */}
          <div className="rounded-md border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase text-slate-600">
                  Grand Total
                </p>
                <p className="mt-1.5 text-xl font-semibold text-accent">
                  {formatPrice(order.grandTotal)}
                </p>
              </div>
              <div className="flex-shrink-0 rounded-md bg-accent/10 p-3 text-accent">
                <FaMoneyBillWave size={18} />
              </div>
            </div>
          </div>

          {/* Total Items */}
          <div className="rounded-md border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase text-slate-600">
                  Total Items
                </p>
                <p className="mt-1.5 text-xl font-semibold text-slate-900">
                  {order.items.length}
                </p>
              </div>
              <div className="flex-shrink-0 rounded-md bg-slate-100 p-3 text-slate-500">
                <FaBoxOpen size={18} />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-md border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase text-slate-600">
                  Payment Method
                </p>
                <p className="mt-1.5 text-base font-semibold text-slate-900">
                  {order.paymentMethod}
                </p>
              </div>
              <div className="flex-shrink-0 rounded-md bg-slate-100 p-3 text-slate-500">
                <FaCreditCard size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* ─── 4. CUSTOMER & SHIPPING INFORMATION ──────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Customer Information */}
          <div className="rounded-md border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
              <FaUser className="h-4 w-4 text-slate-400" />
              <h2 className="text-base font-semibold text-slate-900">
                Customer Information
              </h2>
            </div>

            <dl className="space-y-4">
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs font-medium uppercase text-slate-600">
                  Full Name
                </dt>
                <dd className="text-sm font-medium text-slate-900">
                  {order.customerName}
                </dd>
              </div>

              <div className="flex flex-col gap-0.5">
                <dt className="text-xs font-medium uppercase text-slate-600">
                  Email Address
                </dt>
                <dd className="text-sm font-medium text-slate-900">
                  {order.email}
                </dd>
              </div>

              <div className="flex flex-col gap-0.5">
                <dt className="text-xs font-medium uppercase text-slate-600">
                  Phone Number
                </dt>
                <dd className="text-sm font-medium text-slate-900">
                  {order.phone}
                </dd>
              </div>
            </dl>
          </div>

          {/* Delivery Information */}
          <div className="rounded-md border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
              <FaTruck className="h-4 w-4 text-slate-400" />
              <h2 className="text-base font-semibold text-slate-900">
                Delivery Information
              </h2>
            </div>

            <dl className="space-y-4">
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs font-medium uppercase text-slate-600">
                  Street Address
                </dt>
                <dd className="text-sm font-medium text-slate-900">
                  {order.streetAddress}
                </dd>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-0.5">
                  <dt className="text-xs font-medium uppercase text-slate-600">
                    City
                  </dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {order.city}
                  </dd>
                </div>

                <div className="flex flex-col gap-0.5">
                  <dt className="text-xs font-medium uppercase text-slate-600">
                    District
                  </dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {order.district}
                  </dd>
                </div>
              </div>

              <div className="flex flex-col gap-0.5">
                <dt className="text-xs font-medium uppercase text-slate-600">
                  Postal Code
                </dt>
                <dd className="text-sm font-medium text-slate-900">
                  {order.postalCode}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* ─── 5. ORDERED PRODUCTS ──────────────────────────────────────────────── */}
        <div className="rounded-md border border-slate-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
            <FaBoxOpen className="h-4 w-4 text-slate-400" />
            <div>
              <h2 className="text-base font-semibold text-slate-900">Ordered Products</h2>
              <p className="text-sm text-slate-500">
                {order.items.length} {order.items.length === 1 ? "item" : "items"} in this order
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-md border border-slate-200">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-600">
                    Product
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase text-slate-600">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-600">
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-600">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {order.items.map((item) => (
                  <tr
                    key={item.productId}
                    className="transition-colors duration-150 hover:bg-slate-50"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='100%25' height='100%25' fill='%23f1f5f9'/></svg>";
                          }}
                          className="h-14 w-14 flex-shrink-0 rounded-md border border-slate-200 bg-white object-contain p-1"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {item.name}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            SKU: {item.productId?.slice(-8).toUpperCase() ?? "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                        {item.quantity}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right text-sm text-slate-600">
                      {formatPrice(item.price)}
                    </td>

                    <td className="px-4 py-4 text-right text-sm font-semibold text-slate-900">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── 6. PAYMENT SUMMARY (HIGHLIGHTED) ────────────────────────────────── */}
        <div className="rounded-md border border-accent/20 bg-accent/5 p-6">
          <div className="mb-5 flex items-center gap-2 border-b border-accent/10 pb-4">
            <FaMoneyBillWave className="h-4 w-4 text-accent" />
            <h2 className="text-base font-semibold text-slate-900">Payment Summary</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-medium text-slate-900">
                {formatPrice(order.subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Delivery Fee</span>
              <span className="font-medium text-slate-900">
                {formatPrice(order.deliveryFee)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-slate-600">
                <FaTag className="h-3.5 w-3.5 text-slate-400" />
                Discount
              </span>
              <span className="font-medium text-slate-900">
                − {formatPrice(order.discount)}
              </span>
            </div>

            <div className="mt-2 border-t border-accent/20 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-slate-900">Grand Total</span>
                <span className="text-2xl font-semibold text-accent">
                  {formatPrice(order.grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 7. ADDITIONAL INFORMATION (conditional) ─────────────────────────── */}
        {order.deliveryNotes && (
          <div className="rounded-md border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
              <FaInfoCircle className="h-4 w-4 text-slate-400" />
              <h2 className="text-base font-semibold text-slate-900">
                Additional Information
              </h2>
            </div>

            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-medium uppercase text-slate-600">
                Delivery Notes
              </p>
              <p className="mt-1 text-sm text-slate-700">{order.deliveryNotes}</p>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

export default AdminOrderDetails;