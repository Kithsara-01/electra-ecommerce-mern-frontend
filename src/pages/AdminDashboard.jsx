import { useEffect, useRef, useState } from "react";
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
import RevenueChart from "../components/RevenueChart";

// Order status badges: accent for delivered, rose for cancelled, neutral
// slate for everything still in progress — same scheme used across the app.
const getStatusStyles = (status = "") => {
  switch (status) {
    case "Delivered":
      return "bg-accent/10 text-accent";

    case "Cancelled":
      return "bg-rose-50 text-rose-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

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
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const revenueChartRef = useRef(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getDashboardStats();

      setStats(response.stats);
      setLatestOrders(response.latestOrders || []);
      setLowStockItems(response.lowStockItems || []);
      setMonthlyRevenue(response.monthlyRevenue || []);
      setTopSellingProducts(response.topSellingProducts || []);

    } catch (error) {
      console.log(error);
    }
  };

  const cards = [
    {
      title: "Products",
      value: stats.totalProducts,
      icon: <FaBoxOpen size={22} />,
      path: "/admin/products",
    },

    {
      title: "Customers",
      value: stats.totalCustomers,
      icon: <FaUsers size={22} />,
      path: "/admin/users?role=Customer",
    },

    {
      title: "Orders",
      value: stats.totalOrders,
      icon: <FaCartShopping size={22} />,
      path: "/admin/orders",
    },

    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: <FaClock size={22} />,
      path: "/admin/orders?status=Pending",
    },

    {
      title: "Low Stock",
      value: stats.lowStockProducts,
      icon: <FaTriangleExclamation size={22} />,
      path: "/admin/stocks?filter=low-stock",
    },

    {
      title: "Revenue",
      value: `Rs. ${(stats.totalRevenue || 0).toLocaleString()}`,
      icon: <FaDollarSign size={22} />,
      scrollTo: "revenue-chart",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Dashboard Header */}
        <div className="rounded bg-accent p-8 text-white">
          <h1 className="text-3xl font-bold">
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
                onClick={() => {
                    if (card.scrollTo === "revenue-chart") {
                      revenueChartRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });

                      return;
                    }

                    if (card.path) {
                      navigate(card.path);
                    }
                  }}
                className="cursor-pointer rounded border border-slate-200 bg-white p-6 transition-all hover:border-accent hover:shadow-md"
              >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {card.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {card.value}
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-accent/10 text-accent">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Monthly Revenue Chart */}
        <div ref={revenueChartRef}>
          <RevenueChart data={monthlyRevenue} />
        </div>

        {/* Widgets */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">


          {/* Recent Orders */}
          <div className="rounded border border-slate-200 bg-white p-6 xl:col-span-2">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Orders
                </h2>

                <p className="text-sm text-slate-500">
                  Latest customer orders
                </p>
              </div>

              <button
                onClick={() => navigate("/admin/orders")}
                className="cursor-pointer rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-secondary"
              >
                View All
              </button>
            </div>

            {latestOrders.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-500">
                No recent orders found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="border-b border-slate-200">
                    <tr>
                      <th className="py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Customer
                      </th>

                      <th className="py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Total
                      </th>

                      <th className="py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
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
                          <p className="text-sm font-semibold text-slate-900">
                            {order.customerName}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            #{order._id.slice(-8).toUpperCase()}
                          </p>
                        </td>

                        <td className="py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(
                              order.orderStatus
                            )}`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>

                        <td className="py-4 text-sm font-semibold text-slate-900">
                          Rs. {order.grandTotal.toLocaleString()}
                        </td>

                        <td className="py-4 text-sm text-slate-500">
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
          <div className="rounded border border-slate-200 bg-white p-6">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Low Stock
                </h2>

                <p className="text-sm text-slate-500">
                  Products that need restocking
                </p>
              </div>

              <button
                onClick={() => navigate("/admin/products")}
                className="cursor-pointer text-sm font-semibold text-accent transition-colors hover:text-secondary"
              >
                Manage
              </button>
            </div>

            {lowStockItems.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-500">
                No low stock products.
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockItems.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between rounded-md border border-slate-100 p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {product.name}
                      </p>

                      <p className="text-sm text-slate-500">
                        Stock Remaining
                      </p>
                    </div>

                    <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-bold text-rose-700">
                      {product.stock}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Top Selling Products */}
          <div className="rounded border border-slate-200 bg-white p-6">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                Top Selling Products
              </h2>

              <p className="text-sm text-slate-500">
                Best selling products
              </p>
            </div>

            {topSellingProducts.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-500">
                No sales data available.
              </div>
            ) : (
              <div className="space-y-4">
                {topSellingProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-none"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 rounded-md border object-cover"
                      />

                      <div>
                        <p className="font-semibold text-slate-900">
                          {product.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          Stock : {product.stock}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-bold text-accent">
                      {product.totalSold} Sold
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