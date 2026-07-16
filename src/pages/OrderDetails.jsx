import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaCreditCard,
  FaLocationDot,
  FaReceipt,
  FaTruck,
  FaUser,
} from "react-icons/fa6";

import Header from "../components/Header";
import OrderStatusTracker from "../components/OrderStatusTracker";
import { getOrderById } from "../services/orderService";


const currencyFormatter = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 2,
});

const formatPrice = (value) => {
  if (typeof value === "number") {
    return currencyFormatter.format(value);
  }

  return "N/A";
};

const formatDate = (value) => {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleDateString();
};

const getStatusStyles = (status = "") => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "processing":
      return "bg-blue-100 text-blue-700";
    case "shipped":
      return "bg-purple-100 text-purple-700";
    case "delivered":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

function OrderDetails() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getOrderById(orderId);
        setOrder(response.order || null);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load order.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    } else {
      setError("Order ID is missing.");
      setLoading(false);
    }
  }, [orderId]);

  const items = Array.isArray(order?.items)
    ? order.items
    : Array.isArray(order?.products)
      ? order.products
      : [];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-primary px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
          >
            <FaArrowLeft className="text-xs" />
            Back
          </button>

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold  text-accent">
                Order Details
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-secondary sm:text-4xl">
                Your order at a Glance
              </h1>
            </div>
            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
              {loading ? "Loading order" : error ? "Needs attention" : `Order #${order?._id?.slice(-8).toUpperCase() || "N/A"}`}
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_24px_80px_-24px_rgba(15,23,42,0.24)]">
            <div className="border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6 sm:p-8">
              {loading && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-700 shadow-sm">
                  <p className="text-lg font-semibold text-secondary">Loading order...</p>
                  <p className="mt-2 text-sm text-slate-500">Please wait while we retrieve your order details.</p>
                </div>
              )}

              {error && (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700 shadow-sm">
                  <p className="text-lg font-semibold">{error}</p>
                </div>
              )}

              {!loading && !error && !order && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-700 shadow-sm">
                  <p className="text-lg font-semibold text-secondary">No order found.</p>
                </div>
              )}

              {!loading && !error && order && (
                <div className="space-y-6">
                  <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl bg-accent/10 p-2.5 text-accent">
                            <FaReceipt className="text-lg" />
                          </div>
                          <div>
                            <p className="text-sm font-bold uppercase  text-black">
                              Order overview
                            </p>
                            <h2 className="mt-1 text-xl font-semibold text-secondary">
                              {order._id || "N/A"}
                            </h2>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-semibold ${getStatusStyles(order.orderStatus)}`}>
                          {order.orderStatus || "Pending"}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-sm font-medium text-slate-600">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Order ID</p>
                        <p className="mt-2 font-semibold text-secondary">{order._id || "N/A"}</p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Order Date</p>
                        <p className="mt-2 font-semibold text-secondary">{formatDate(order.createdAt)}</p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Status</p>
                        <p className="mt-2 font-semibold text-secondary">{order.orderStatus || "Pending"}</p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Payment Method</p>
                        <p className="mt-2 font-semibold text-secondary">{order.paymentMethod || "Cash on Delivery"}</p>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-500">
                            Order Progress
                        </p>
                        <h3 className="mt-1 text-xl font-semibold text-secondary">
                          Order #{(order._id || "").slice(-8).toUpperCase() || "N/A"}
                        </h3>
                      </div>
                    </div>

                    <div className="mt-6">
                      <OrderStatusTracker currentStatus={order.orderStatus} />
                    </div>
                  </section>

                  <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-accent/10 p-2.5 text-accent">
                          <FaUser className="text-lg" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-secondary">Customer Information</h3>
                          <p className="text-sm text-slate-500">Personal and contact details</p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-sm text-slate-500">Customer Name</p>
                          <p className="mt-1 font-semibold text-secondary">
                            {order.customerName || order.user?.name || "N/A"}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-sm text-slate-500">Email</p>
                          <p className="mt-1 font-semibold text-secondary">{order.email || order.user?.email || "N/A"}</p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-sm text-slate-500">Phone Number</p>
                          <p className="mt-1 font-semibold text-secondary">{order.phone || "N/A"}</p>
                        </div>
                      </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-accent/10 p-2.5 text-accent">
                          <FaTruck className="text-lg" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-secondary">Delivery Information</h3>
                          <p className="text-sm text-slate-500">Shipping destination and notes</p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-sm text-slate-500">Street Address</p>
                          <p className="mt-1 font-semibold text-secondary">{order.streetAddress || order.deliveryAddress || "N/A"}</p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">City</p>
                            <p className="mt-1 font-semibold text-secondary">{order.city || "N/A"}</p>
                          </div>
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">District</p>
                            <p className="mt-1 font-semibold text-secondary">{order.district || "N/A"}</p>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-sm text-slate-500">Postal Code</p>
                          <p className="mt-1 font-semibold text-secondary">{order.postalCode || "N/A"}</p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-slate-500">
                            <FaLocationDot className="text-sm" />
                            <p className="text-sm">Delivery Notes</p>
                          </div>
                          <p className="mt-2 font-semibold text-secondary">
                            {order.deliveryNotes ? order.deliveryNotes : "No delivery notes."}
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>

                  <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-accent/10 p-2.5 text-accent">
                          <FaBoxOpen className="text-lg" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-secondary">Ordered Products</h3>
                          <p className="text-sm text-slate-500">Every item in this order</p>
                        </div>
                      </div>

                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-sm font-medium text-slate-600">
                        {items.length} item{items.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className="mt-6 space-y-4">
                      {items.map((item, index) => (
                        <div
                          key={item.productId || item._id || `${item.name}-${index}`}
                          className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={item.image || item.productImage || "https://via.placeholder.com/96"}
                              alt={item.name || "Product"}
                              className="h-20 w-20 rounded-2xl object-cover shadow-sm"
                            />
                            <div>
                              <h4 className="font-semibold text-secondary">{item.name || "Product"}</h4>
                              <p className="mt-1 text-sm text-slate-500">Quantity: {item.quantity || 0}</p>
                            </div>
                          </div>

                          <div className="grid gap-3 text-sm md:grid-cols-3 md:gap-8">
                            <div>
                              <p className="text-slate-500">Unit Price</p>
                              <p className="mt-1 font-semibold text-secondary">{formatPrice(item.price)}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Quantity</p>
                              <p className="mt-1 font-semibold text-secondary">{item.quantity || 0}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Line Total</p>
                              <p className="mt-1 font-semibold text-secondary">
                                {formatPrice((item.price || 0) * (item.quantity || 0))}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-accent/10 p-2.5 text-accent">
                        <FaCreditCard className="text-lg" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-secondary">Payment Summary</h3>
                        <p className="text-sm text-slate-500">A clear breakdown of your charges</p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4 text-sm text-slate-700">
                      <div className="flex items-center justify-between">
                        <span>Subtotal</span>
                        <span className="font-medium text-secondary">{formatPrice(order.subtotal ?? order.totalAmount ?? 0)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Delivery Fee</span>
                        <span className="font-medium text-secondary">{formatPrice(order.deliveryFee ?? 0)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Discount</span>
                        <span className="font-medium text-secondary">{formatPrice(order.discount ?? 0)}</span>
                      </div>

                      <div className="mt-4 border-t border-slate-200 pt-4">
                        <div className="flex items-center justify-between text-base font-semibold text-secondary">
                          <span>Grand Total</span>
                          <span className="text-2xl text-emerald-600">
                            {formatPrice(order.grandTotal ?? order.totalAmount ?? 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetails;
