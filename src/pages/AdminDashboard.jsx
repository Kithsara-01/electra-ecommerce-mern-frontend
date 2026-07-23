import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../components/AdminLayout";
import { useAuth } from "../context/AuthContext";

import {
  FaUsers,
  FaBoxOpen,
  FaCartShopping,
  FaDollarSign,
  FaClock,
  FaTriangleExclamation,
} from "react-icons/fa6";
import { HiOutlineHandRaised } from "react-icons/hi2";

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
  const { user } = useAuth();

  const firstName = user?.name?.trim().split(" ")[0] || "Admin";

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
      icon: <FaBoxOpen size={20} />,
      path: "/admin/products",
    },

    {
      title: "Customers",
      value: stats.totalCustomers,
      icon: <FaUsers size={20} />,
      path: "/admin/users?role=Customer",
    },

    {
      title: "Orders",
      value: stats.totalOrders,
      icon: <FaCartShopping size={20} />,
      path: "/admin/orders",
    },

    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: <FaClock size={20} />,
      path: "/admin/orders?status=Pending",
    },

    {
      title: "Low Stock",
      value: stats.lowStockProducts,
      icon: <FaTriangleExclamation size={20} />,
      path: "/admin/stocks?filter=low-stock",
    },

    {
      title: "Revenue",
      value: `Rs. ${(stats.totalRevenue || 0).toLocaleString()}`,
      icon: <FaDollarSign size={20} />,
      path: "/admin/revenue"
    },
  ];

  const cardBase =
    "rounded-lg border border-slate-200/70 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md";

  return (
    <AdminLayout>
      <div className="space-y-8 pb-4">

        {/* Dashboard Header */}
        <div className="rounded-lg bg-accent px-6 py-8 text-white shadow-sm sm:px-8">
          <div className="flex items-center gap-2.5">
            <HiOutlineHandRaised className="h-7 w-7 flex-shrink-0 sm:h-8 sm:w-8" />

            <h1 className="text-2xl font-bold sm:text-3xl">
              Welcome Back, {firstName}
            </h1>
          </div>

          <p className="mt-2.5 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
            Manage your store, monitor sales, and stay updated with today's
            business activities.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
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
                className={`${cardBase} cursor-pointer p-5 sm:p-6`}
              >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500">
                    {card.title}
                  </p>

                  <h2 className="mt-2 truncate text-2xl font-bold text-slate-900 sm:text-3xl">
                    {card.value}
                  </h2>
                </div>

                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/15 sm:h-14 sm:w-14">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Revenue Chart */}
        <div
          ref={revenueChartRef}
          className={`${cardBase} p-5 sm:p-6`}
        >
          <div className="mb-5 flex items-center gap-3 sm:mb-6">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/15">
              <FaDollarSign size={18} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                Monthly Revenue
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Revenue generated each month
              </p>
            </div>
          </div>

          <RevenueChart data={monthlyRevenue} />
        </div>

        {/* Widgets */}
        <div className="grid grid-cols-1 gap-5 sm:gap-6 xl:grid-cols-3">

          {/* Recent Orders */}
          <div className={`${cardBase} p-5 sm:p-6 xl:col-span-2`}>

            <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Orders
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Latest customer orders
                </p>
              </div>

              <button
                onClick={() => navigate("/admin/orders")}
                className="cursor-pointer self-start rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-secondary sm:self-auto"
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
          <div className={`${cardBase} p-5 sm:p-6`}>

            <div className="mb-5 flex items-center justify-between sm:mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Low Stock
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
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
                    className="flex items-center justify-between rounded-md border border-slate-100 p-3 transition-colors hover:border-accent/30"
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
          <div className={`${cardBase} p-5 sm:p-6`}>
            <div className="mb-5 sm:mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Top Selling Products
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
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
                        className="h-12 w-12 rounded-md border border-slate-200 object-cover"
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