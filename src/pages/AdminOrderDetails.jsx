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
      return "bg-yellow-100 text-yellow-700";

    case "Processing":
      return "bg-blue-100 text-blue-700";

    case "Shipped":
      return "bg-purple-100 text-purple-700";

    case "Delivered":
      return "bg-green-100 text-green-700";

    case "Cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
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
      setError(
        err.response?.data?.message ||
          "Failed to load order."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Order Details">
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <h2 className="text-2xl font-semibold">
            Loading Order...
          </h2>

          <p className="mt-2 text-slate-500">
            Please wait while we load the order details.
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Order Details">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-12 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-red-700">
            {error}
          </h2>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Order Details">

      <div className="space-y-6">

        {/* Header */}

        <div className="rounded-3xl bg-gradient-to-r from-[#2FA084] to-[#25856d] p-8 text-white shadow-xl">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <button
                onClick={() => navigate(-1)}
                className="mb-5 flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm transition hover:bg-white/30"
              >
                <FaArrowLeft />

                Back
              </button>

              <h1 className="text-4xl font-bold">
                Order Details
              </h1>

              <p className="mt-2 text-white/90">
                Order #
                {order._id.slice(-8).toUpperCase()}
              </p>

            </div>

            <span
              className={`rounded-full px-5 py-2 text-sm font-semibold ${getStatusBadge(
                order.orderStatus
              )}`}
            >
              {order.orderStatus}
            </span>

          </div>

        </div>

        {/* Order Tracker */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-secondary">
            Order Progress
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current delivery status
          </p>

          <div className="mt-8">
            <OrderStatusTracker
              currentStatus={order.orderStatus}
            />
          </div>

        </div>

        {/* Summary Cards */}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Customer
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  {order.customerName}
                </h2>

              </div>

              <div className="rounded-xl bg-accent/10 p-4 text-accent">
                <FaUser size={22} />
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Grand Total
                </p>

                <h2 className="mt-2 text-2xl font-bold text-accent">
                  {formatPrice(order.grandTotal)}
                </h2>

              </div>

              <div className="rounded-xl bg-accent/10 p-4 text-accent">
                <FaMoneyBillWave size={22} />
              </div>

            </div>

          </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Total Items
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {order.items.length}
                </h2>

              </div>

              <div className="rounded-xl bg-accent/10 p-4 text-accent">
                <FaBoxOpen size={22} />
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Payment
                </p>

                <h2 className="mt-2 text-lg font-bold">
                  {order.paymentMethod}
                </h2>

              </div>

              <div className="rounded-xl bg-accent/10 p-4 text-accent">
                <FaCreditCard size={22} />
              </div>

            </div>

          </div>

        </div>

        {/* Customer & Delivery */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Customer Information */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-secondary">
              Customer Information
            </h2>

            <div className="mt-6 space-y-5">

              <div>
                <p className="text-sm text-slate-500">
                  Full Name
                </p>

                <p className="mt-1 font-semibold">
                  {order.customerName}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Email Address
                </p>

                <p className="mt-1 font-semibold">
                  {order.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Phone Number
                </p>

                <p className="mt-1 font-semibold">
                  {order.phone}
                </p>
              </div>

            </div>

          </div>

          {/* Delivery Information */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-secondary">
              Delivery Information
            </h2>

            <div className="mt-6 space-y-5">

              <div>
                <p className="text-sm text-slate-500">
                  Street Address
                </p>

                <p className="mt-1 font-semibold">
                  {order.streetAddress}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  City
                </p>

                <p className="mt-1 font-semibold">
                  {order.city}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  District
                </p>

                <p className="mt-1 font-semibold">
                  {order.district}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Postal Code
                </p>

                <p className="mt-1 font-semibold">
                  {order.postalCode}
                </p>
              </div>

              {order.deliveryNotes && (
                <div>
                  <p className="text-sm text-slate-500">
                    Delivery Notes
                  </p>

                  <p className="mt-1 font-semibold">
                    {order.deliveryNotes}
                  </p>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Order Summary */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-secondary">
            Order Summary
          </h2>

          <div className="mt-6 space-y-4">

            <div className="flex justify-between">
              <span className="text-slate-600">
                Subtotal
              </span>

              <span className="font-semibold">
                {formatPrice(order.subtotal)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600">
                Delivery Fee
              </span>

              <span className="font-semibold">
                {formatPrice(order.deliveryFee)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600">
                Discount
              </span>

              <span className="font-semibold">
                - {formatPrice(order.discount)}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-4">

              <div className="flex justify-between">

                <span className="text-lg font-bold">
                  Grand Total
                </span>

                <span className="text-2xl font-bold text-accent">
                  {formatPrice(order.grandTotal)}
                </span>

              </div>

            </div>

          </div>

        </div>
                {/* Ordered Products */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-secondary">
                Ordered Products
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Products included in this order
              </p>

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr>

                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                    Product
                  </th>

                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-600">
                    Quantity
                  </th>

                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">
                    Unit Price
                  </th>

                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">
                    Total
                  </th>

                </tr>

              </thead>

              <tbody>

                {order.items.map((item) => (

                  <tr
                    key={item.productId}
                    className="border-b border-slate-100 transition duration-200 hover:bg-slate-50"
                  >

                    <td className="px-4 py-5">

                      <div className="flex items-center gap-4">

                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-xl border border-slate-200 object-cover"
                        />

                        <div>

                          <h3 className="font-semibold text-secondary">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            Product Item
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-4 py-5 text-center">

                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 font-semibold text-accent">
                        {item.quantity}
                      </span>

                    </td>

                    <td className="px-4 py-5 text-right font-medium">
                      {formatPrice(item.price)}
                    </td>

                    <td className="px-4 py-5 text-right font-bold text-secondary">
                      {formatPrice(item.price * item.quantity)}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </AdminLayout>
  );
}

export default AdminOrderDetails;