import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../components/AdminLayout";
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

function AdminOrderDetails() {
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
    <AdminLayout title="Order Details">
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <span className="mr-2 text-base">←</span>
                Back
              </button>
              <div>
                <p className="text-sm font-medium text-slate-500">Order Overview</p>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <h1 className="text-xl font-semibold text-slate-900">
                    Order #{(order?._id || "").slice(-8).toUpperCase() || "N/A"}
                  </h1>
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusStyles(order?.orderStatus)}`}>
                    {order?.orderStatus || "Pending"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="text-[11px] font-semibold  text-black">
                  Order Date
                </p>
                <p className="mt-1 font-semibold text-slate-900">{formatDate(order?.createdAt)}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="text-[11px] font-semibold  text-black">
                  Payment
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {order?.paymentMethod || "Cash on Delivery"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {!loading && !error && order && (
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                    Order Progress
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  Order #{(order._id || "").slice(-8).toUpperCase() || "N/A"}
                </h2>
              </div>
            </div>

            <div className="mt-6">
              <OrderStatusTracker currentStatus={order.orderStatus} />
            </div>
          </section>
        )}

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-900">Loading order...</p>
            <p className="mt-2 text-sm text-slate-500">Please wait while we fetch the order details.</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-rose-700">{error}</p>
          </div>
        )}

        {!loading && !error && !order && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-900">No order found.</p>
          </div>
        )}

        {!loading && !error && order && (
          <>
            <div className="grid gap-6 xl:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Customer</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {order.customerName || order.user?.name || "N/A"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Grand Total</p>
                <p className="mt-2 text-2xl font-semibold text-[#2FA084]">
                  {formatPrice(order.grandTotal ?? order.totalAmount ?? 0)}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Items</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{items.length}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Status</p>
                <div className="mt-2">
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusStyles(order.orderStatus)}`}>
                    {order.orderStatus || "Pending"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6">
                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Customer Information</h2>
                  <div className="mt-5 space-y-3 text-sm text-slate-700">
                    <div>
                      <p className="text-slate-500">Customer Name</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {order.customerName || order.user?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Email</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {order.email || order.user?.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Phone</p>
                      <p className="mt-1 font-semibold text-slate-900">{order.phone || "N/A"}</p>
                    </div>
                  </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Delivery Information</h2>
                  <div className="mt-5 space-y-3 text-sm text-slate-700">
                    <div>
                      <p className="text-slate-500">Street</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {order.streetAddress || order.deliveryAddress || "N/A"}
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-slate-500">City</p>
                        <p className="mt-1 font-semibold text-slate-900">{order.city || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">District</p>
                        <p className="mt-1 font-semibold text-slate-900">{order.district || "N/A"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-500">Postal Code</p>
                      <p className="mt-1 font-semibold text-slate-900">{order.postalCode || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Delivery Notes</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {order.deliveryNotes ? order.deliveryNotes : "No delivery notes."}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>
                <div className="mt-5 space-y-3 text-sm text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">{formatPrice(order.subtotal ?? order.totalAmount ?? 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-slate-900">{formatPrice(order.deliveryFee ?? 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Discount</span>
                    <span className="font-semibold text-slate-900">{formatPrice(order.discount ?? 0)}</span>
                  </div>
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <div className="flex items-center justify-between text-base font-semibold text-slate-900">
                      <span>Grand Total</span>
                      <span className="text-xl text-[#2FA084]">
                        {formatPrice(order.grandTotal ?? order.totalAmount ?? 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Ordered Products</h2>
                  <p className="text-sm text-slate-500">A clean list of all products in this order</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  {items.length} item{items.length === 1 ? "" : "s"}
                </span>
              </div>

              {items.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
                  No products found in this order.
                </div>
              ) : (
                <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-black">
                          Image
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-black">
                          Product Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold  text-black">
                          Unit Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold  text-black">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold  text-black">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {items.map((item, index) => (
                        <tr key={item.productId || item._id || `${item.name}-${index}`} className="transition hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <img
                              src={item.image || item.productImage || "https://via.placeholder.com/96"}
                              alt={item.name || "Product"}
                              className="h-14 w-14 rounded-lg object-cover"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <p className=" text-slate-900">{item.name || "Product"}</p>
                          </td>
                          <td className="px-4 py-3 text-sm text-black">{formatPrice(item.price)}</td>
                          <td className="px-4 py-3 text-sm text-black">{item.quantity || 0}</td>
                          <td className="px-4 py-3 text-sm  text-slate-900">
                            {formatPrice((item.price || 0) * (item.quantity || 0))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminOrderDetails;
