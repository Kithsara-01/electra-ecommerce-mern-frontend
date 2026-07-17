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

  if (loading) {
    return (
      <>
        <Header />

        <div className="min-h-screen bg-primary flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">
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
        <Header />

        <div className="min-h-screen bg-primary flex items-center justify-center">
          <div className="rounded-2xl bg-white p-8 shadow">
            <h2 className="text-red-600 font-bold">
              {error}
            </h2>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-primary py-10">

        <div className="mx-auto max-w-7xl px-5">

          <button
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-slate-50"
          >
            <FaArrowLeft />
            Back
          </button>

          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-widest text-accent">
                Order Details
              </p>

              <h1 className="mt-2 text-4xl font-bold text-secondary">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>

              <p className="mt-2 text-slate-500">
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

          {/* Overview */}

          <section className="rounded-2xl border border-slate-200 bg-white p-8">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-accent/10 p-3 text-accent">
                <FaReceipt />
              </div>

              <div>

                <h2 className="text-xl font-semibold text-secondary">
                  Order Overview
                </h2>

                <p className="text-sm text-slate-500">
                  Basic information about this order
                </p>

              </div>

            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

              <div>

                <p className="text-sm text-slate-500">
                  Order ID
                </p>

                <p className="mt-2 font-semibold">
                  {order._id}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Order Date
                </p>

                <p className="mt-2 font-semibold">
                  {formatDate(order.createdAt)}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Status
                </p>

                <p className="mt-2 font-semibold">
                  {order.orderStatus}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Payment
                </p>

                <p className="mt-2 font-semibold">
                  {order.paymentMethod}
                </p>

              </div>

            </div>

          </section>

          {/* Progress */}

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">

            <div className="mb-6">

              <h2 className="text-xl font-semibold text-secondary">
                Order Progress
              </h2>

              <p className="text-sm text-slate-500">
                Current shipping progress
              </p>

            </div>

            <OrderStatusTracker
              currentStatus={order.orderStatus}
            />

          </section>

          {/* ======= Customer + Delivery starts here ======= */}
          {/* Customer + Delivery */}
<div className="mt-8 grid gap-6 lg:grid-cols-2">

  {/* Customer Information */}
  <section className="rounded-2xl border border-slate-200 bg-white p-8">

    <div className="mb-8 flex items-center gap-3">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <FaUser />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-secondary">
          Customer Information
        </h2>

        <p className="text-sm text-slate-500">
          Contact information of the customer
        </p>
      </div>

    </div>

    <div className="space-y-6">

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Full Name
        </p>

        <p className="mt-1 text-base font-medium text-secondary">
          {order.customerName || "N/A"}
        </p>
      </div>

      <div className="border-t border-slate-100"></div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Email Address
        </p>

        <p className="mt-1 text-base font-medium text-secondary">
          {order.email || "N/A"}
        </p>
      </div>

      <div className="border-t border-slate-100"></div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Phone Number
        </p>

        <p className="mt-1 text-base font-medium text-secondary">
          {order.phone || "N/A"}
        </p>
      </div>

    </div>

  </section>

  {/* Delivery Information */}
  <section className="rounded-2xl border border-slate-200 bg-white p-8">

    <div className="mb-8 flex items-center gap-3">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <FaTruck />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-secondary">
          Delivery Information
        </h2>

        <p className="text-sm text-slate-500">
          Shipping destination details
        </p>
      </div>

    </div>

    <div className="space-y-6">

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Street Address
        </p>

        <p className="mt-1 text-base font-medium text-secondary">
          {order.streetAddress || "N/A"}
        </p>
      </div>

      <div className="border-t border-slate-100"></div>

      <div className="grid grid-cols-2 gap-6">

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            City
          </p>

          <p className="mt-1 text-base font-medium text-secondary">
            {order.city || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            District
          </p>

          <p className="mt-1 text-base font-medium text-secondary">
            {order.district || "N/A"}
          </p>
        </div>

      </div>

      <div className="border-t border-slate-100"></div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Postal Code
        </p>

        <p className="mt-1 text-base font-medium text-secondary">
          {order.postalCode || "N/A"}
        </p>
      </div>

      <div className="border-t border-slate-100"></div>

      <div>

        <div className="mb-2 flex items-center gap-2 text-slate-500">
          <FaLocationDot className="text-sm" />

          <p className="text-xs font-semibold uppercase tracking-wider">
            Delivery Notes
          </p>
        </div>

        <p className="text-base font-medium text-secondary">
          {order.deliveryNotes || "No delivery notes."}
        </p>

      </div>

    </div>

  </section>

</div>

{/* ===== Ordered Products starts here ===== */}
{/* Ordered Products */}
<section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">

  <div className="mb-8 flex items-center gap-3">

    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
      <FaBoxOpen />
    </div>

    <div>
      <h2 className="text-xl font-semibold text-secondary">
        Ordered Products
      </h2>

      <p className="text-sm text-slate-500">
        Items included in this order
      </p>
    </div>

  </div>

  {items.length === 0 ? (

    <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center text-slate-500">
      No products found.
    </div>

  ) : (

    <div className="divide-y divide-slate-100">

      {items.map((item) => (

        <div
          key={item.productId}
          className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between"
        >

          {/* Left */}
          <div className="flex items-center gap-4">

            <img
              src={item.image}
              alt={item.name}
              className="h-20 w-20 rounded-xl border border-slate-200 object-cover"
            />

            <div>

              <h3 className="text-lg font-semibold text-secondary">
                {item.name}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Quantity : {item.quantity}
              </p>

            </div>

          </div>

          {/* Right */}
          <div className="text-left sm:text-right">

            <p className="text-sm text-slate-500">
              Unit Price
            </p>

            <p className="font-medium text-secondary">
              {formatPrice(item.price)}
            </p>

            <p className="mt-3 text-sm text-slate-500">
              Total
            </p>

            <p className="text-lg font-bold text-accent">
              {formatPrice(item.price * item.quantity)}
            </p>

          </div>

        </div>

      ))}

    </div>

  )}

</section>

{/* ===== Payment Summary starts here ===== */}
{/* Payment Summary */}
<section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">

  <div className="mb-8 flex items-center gap-3">

    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
      <FaCreditCard />
    </div>

    <div>
      <h2 className="text-xl font-semibold text-secondary">
        Payment Summary
      </h2>

      <p className="text-sm text-slate-500">
        Final breakdown of your order
      </p>
    </div>

  </div>

  <div className="space-y-5">

    <div className="flex items-center justify-between">
      <span className="text-slate-500">
        Subtotal
      </span>

      <span className="font-semibold text-secondary">
        {formatPrice(order.subtotal)}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="text-slate-500">
        Delivery Fee
      </span>

      <span className="font-semibold text-secondary">
        {formatPrice(order.deliveryFee)}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="text-slate-500">
        Discount
      </span>

      <span className="font-semibold text-secondary">
        - {formatPrice(order.discount)}
      </span>
    </div>

    <div className="border-t border-slate-200 pt-5">

      <div className="flex items-center justify-between">

        <span className="text-xl font-bold text-secondary">
          Grand Total
        </span>

        <span className="text-3xl font-bold text-accent">
          {formatPrice(order.grandTotal)}
        </span>

      </div>

    </div>

    <div className="rounded-xl border border-green-200 bg-green-50 p-4">

      <p className="text-sm font-semibold text-green-700">
        Payment Method
      </p>

      <p className="mt-1 text-base font-medium text-secondary">
        {order.paymentMethod}
      </p>

    </div>

  </div>

</section>

</div>

</div>

</>

);
}

export default OrderDetails;