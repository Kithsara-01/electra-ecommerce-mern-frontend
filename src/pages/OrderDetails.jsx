import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaBoxOpen,
  FaCreditCard,
  FaLocationDot,
  FaTruck,
  FaUser,
} from "react-icons/fa6";

import Header from "../components/Header";
import OrderStatusTracker from "../components/OrderStatusTracker";
import { getOrderById } from "../services/orderService";

const currencyFormatter = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 0,
});

const formatPrice = (value) => {
  if (typeof value === "number") {
    return currencyFormatter.format(value);
  }

  return "LKR 0";
};

const formatDate = (value) => {
  if (!value) return "N/A";

  return new Date(value).toLocaleDateString("en-LK", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// Status badges: accent for the positive/delivered state, rose for cancelled,
// neutral slate for everything still in progress.
const getStatusStyles = (status = "") => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-accent/10 text-accent";

    case "cancelled":
      return "bg-rose-50 text-rose-700";

    case "pending":
    case "processing":
    case "shipped":
      return "bg-slate-100 text-slate-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

// Label/value pair reused across every section of the page.
function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value || "N/A"}</p>
    </div>
  );
}

// Section heading used inside the single page — no card border, just an
// icon + title + subtitle, since everything now lives in one white sheet.
function SectionHeading({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
        <Icon />
      </div>
      <div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );
}

function OrderDetails() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);

      const response = await getOrderById(orderId);

      setOrder(response.order);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to load order details."
      );
    } finally {
      setLoading(false);
    }
  };

  const items = order?.items || [];

  const handleImageError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src =
      "https://placehold.co/80x80/FFFFFF/94A3B8?text=No+Image";
  };

  if (loading) {
    return (
      <>
        <Header showSearch={false} />

        <div className="flex min-h-screen items-center justify-center bg-primary">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              Loading Order...
            </h2>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header showSearch={false} />

        <div className="flex min-h-screen items-center justify-center bg-primary">
          <div className="rounded border border-rose-200 bg-rose-50 p-8">
            <h2 className="font-semibold text-rose-700">{error}</h2>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header showSearch={false} />

      <div className="min-h-screen bg-primary py-10">
        <div className="mx-auto max-w-6xl px-5">
          {/* Back sits outside the sheet */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-accent hover:text-accent"
          >
            <FaArrowLeft />
            Back
          </button>

          {/* Everything else lives inside one continuous white sheet */}
          <div className="rounded border border-slate-200 bg-white p-6 sm:p-8">
            {/* Title + badges */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Order Details
                </p>
                <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                  Order #{order._id.slice(-8).toUpperCase()}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Review every detail about your purchase.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyles(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>

                <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
                  {formatDate(order.createdAt)}
                </span>
              </div>
            </div>

            {/* Order meta */}
            <div className="mt-6 grid grid-cols-2 gap-6 border-t border-slate-100 pt-6 sm:grid-cols-4">
              <InfoRow label="Order ID" value={order._id} />
              <InfoRow label="Order Date" value={formatDate(order.createdAt)} />
              <InfoRow label="Status" value={order.orderStatus} />
              <InfoRow label="Payment" value={order.paymentMethod} />
            </div>

            {/* Progress */}
            <div className="mt-8 border-t border-slate-100 pt-8">
              <div className="mb-6">
                <h2 className="text-base font-semibold text-slate-900">
                  Order Progress
                </h2>
                <p className="text-sm text-slate-500">Current shipping progress</p>
              </div>

              <OrderStatusTracker currentStatus={order.orderStatus} />
            </div>

            {/* Customer + Delivery */}
            <div className="mt-8 grid gap-8 border-t border-slate-100 pt-8 lg:grid-cols-2">
              <div>
                <SectionHeading
                  icon={FaUser}
                  title="Customer Information"
                  subtitle="Contact information of the customer"
                />

                <div className="space-y-4">
                  <InfoRow label="Full Name" value={order.customerName} />
                  <div className="border-t border-slate-100" />
                  <InfoRow label="Email Address" value={order.email} />
                  <div className="border-t border-slate-100" />
                  <InfoRow label="Phone Number" value={order.phone} />
                </div>
              </div>

              <div>
                <SectionHeading
                  icon={FaTruck}
                  title="Delivery Information"
                  subtitle="Shipping destination details"
                />

                <div className="space-y-4">
                  <InfoRow label="Street Address" value={order.streetAddress} />

                  <div className="border-t border-slate-100" />

                  <div className="grid grid-cols-2 gap-6">
                    <InfoRow label="City" value={order.city} />
                    <InfoRow label="District" value={order.district} />
                  </div>

                  <div className="border-t border-slate-100" />

                  <InfoRow label="Postal Code" value={order.postalCode} />

                  <div className="border-t border-slate-100" />

                  <div>
                    <div className="mb-1 flex items-center gap-2 text-slate-500">
                      <FaLocationDot className="text-sm" />
                      <p className="text-xs font-semibold uppercase tracking-wider">
                        Delivery Notes
                      </p>
                    </div>
                    <p className="text-sm font-medium text-slate-900">
                      {order.deliveryNotes || "No delivery notes."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ordered Products */}
            <div className="mt-8 border-t border-slate-100 pt-8">
              <SectionHeading
                icon={FaBoxOpen}
                title="Ordered Products"
                subtitle="Items included in this order"
              />

              {items.length === 0 ? (
                <div className="rounded border border-dashed border-slate-300 py-12 text-center text-sm text-slate-500">
                  No products found.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          onError={handleImageError}
                          className="h-16 w-16 rounded border border-slate-200 bg-white object-contain p-1"
                        />
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            Qty <strong className="text-slate-700">{item.quantity}</strong>{" "}
                            &middot; {formatPrice(item.price)} each
                          </p>
                        </div>
                      </div>

                      <p className="text-sm font-semibold text-accent sm:text-right">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <div className="mt-8 border-t border-slate-100 pt-8">
              <SectionHeading icon={FaCreditCard} title="Payment Summary" />

              <div className="max-w-sm space-y-3 sm:ml-auto">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Delivery Fee</span>
                  <span className="font-semibold text-slate-900">
                    {formatPrice(order.deliveryFee)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Discount</span>
                  <span className="font-semibold text-slate-900">
                    - {formatPrice(order.discount)}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-slate-900">
                      Grand Total
                    </span>
                    <span className="text-xl font-bold text-accent">
                      {formatPrice(order.grandTotal)}
                    </span>
                  </div>
                </div>

                <div className="rounded border border-accent/20 bg-accent/10 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                    Payment Method
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetails;