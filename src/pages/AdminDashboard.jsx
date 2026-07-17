import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../components/AdminLayout";

import {
  FaUsers,
  FaBoxOpen,
  FaCartShopping,
  FaDollarSign,
  FaClock,
  FaTriangleExclamation,
} from "react-icons/fa6";

import { getDashboardStats } from "../services/dashboardService";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    totalRevenue: 0,
  });

  const [latestOrders, setLatestOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getDashboardStats();

      setStats(response.stats);
      setLatestOrders(response.latestOrders || []);
      setLowStockItems(response.lowStockItems || []);
    } catch (error) {
      console.log(error);
    }
  };

  const cards = [
    {
      title: "Products",
      value: stats.totalProducts,
      icon: <FaBoxOpen size={24} />,
    },
    {
      title: "Customers",
      value: stats.totalCustomers,
      icon: <FaUsers size={24} />,
    },
    {
      title: "Orders",
      value: stats.totalOrders,
      icon: <FaCartShopping size={24} />,
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: <FaClock size={24} />,
    },
    {
      title: "Low Stock",
      value: stats.lowStockProducts,
      icon: <FaTriangleExclamation size={24} />,
    },
    {
      title: "Revenue",
      value: `Rs. ${(stats.totalRevenue || 0).toLocaleString()}`,
      icon: <FaDollarSign size={24} />,
    },
  ];
    return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Dashboard Header */}
        <div className="rounded-3xl bg-gradient-to-r from-[#2FA084] to-[#25856d] p-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold">
            Welcome Back 👋
          </h1>

          <p className="mt-2 text-white/90">
            Here's what's happening in your store today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {card.title}
                  </p>

                  <h2 className="mt-2 text-4xl font-bold text-secondary">
                    {card.value}
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Widgets */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Recent Orders */}
          <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-secondary">
                  Recent Orders
                </h2>

                <p className="text-sm text-slate-500">
                  Latest customer orders
                </p>
              </div>

              <button
                onClick={() => navigate("/admin/orders")}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-[#25856d]"
              >
                View All
              </button>
            </div>

            {latestOrders.length === 0 ? (
              <div className="py-10 text-center text-slate-500">
                No recent orders found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="border-b border-slate-200">
                    <tr>
                      <th className="py-3 text-left text-sm font-semibold text-slate-600">
                        Customer
                      </th>

                      <th className="py-3 text-left text-sm font-semibold text-slate-600">
                        Status
                      </th>

                      <th className="py-3 text-left text-sm font-semibold text-slate-600">
                        Total
                      </th>

                      <th className="py-3 text-left text-sm font-semibold text-slate-600">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {latestOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-slate-100 last:border-none"
                      >
                        <td className="py-4">
                          <p className="font-semibold text-secondary">
                            {order.customerName}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            #{order._id.slice(-8).toUpperCase()}
                          </p>
                        </td>

                        <td className="py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              order.orderStatus === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : order.orderStatus === "Processing"
                                ? "bg-blue-100 text-blue-700"
                                : order.orderStatus === "Shipped"
                                ? "bg-purple-100 text-purple-700"
                                : order.orderStatus === "Delivered"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>

                        <td className="py-4 font-semibold">
                          Rs. {order.grandTotal.toLocaleString()}
                        </td>

                        <td className="py-4 text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-LK",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Low Stock */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-secondary">
                  Low Stock
                </h2>

                <p className="text-sm text-slate-500">
                  Products that need restocking
                </p>
              </div>

              <button
                onClick={() => navigate("/admin/products")}
                className="text-sm font-semibold text-accent hover:underline"
              >
                Manage
              </button>
            </div>

            {lowStockItems.length === 0 ? (
              <div className="py-10 text-center text-slate-500">
                No low stock products.
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockItems.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 p-3"
                  >
                    <div>
                      <p className="font-semibold text-secondary">
                        {product.name}
                      </p>

                      <p className="text-sm text-slate-500">
                        Stock Remaining
                      </p>
                    </div>

                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-600">
                      {product.stock}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;