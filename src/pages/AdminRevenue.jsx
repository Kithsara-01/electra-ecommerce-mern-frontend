import { useEffect, useState } from "react";
import { FaMoneyBillWave, FaShoppingCart, FaCalendarDay } from "react-icons/fa";

import AdminLayout from "../components/AdminLayout";
import RevenueChart from "../components/RevenueChart";

import { getRevenueAnalytics } from "../services/dashboardService";

function AdminRevenue() {
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    todayRevenue: 0,
    totalOrders: 0,
  });

  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [productRevenue, setProductRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("monthly");

 useEffect(() => {
    fetchRevenueAnalytics();
  }, [filter]);

  const fetchRevenueAnalytics = async () => {
    try {
      const data = await getRevenueAnalytics(filter);

      setSummary(data.summary);
      setMonthlyRevenue(data.monthlyRevenue);
      console.table(data.productRevenue);///////////
      setProductRevenue(data.productRevenue);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Revenue Analytics">
        <div className="rounded-xl bg-white p-10 text-center shadow">
          Loading...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Revenue Analytics">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow">
            <FaMoneyBillWave className="mb-3 text-3xl text-green-600" />

            <p className="text-gray-500">Total Revenue</p>

            <h2 className="mt-2 text-3xl font-bold">
              Rs. {summary.totalRevenue.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <FaCalendarDay className="mb-3 text-3xl text-blue-600" />

            <p className="text-gray-500">Today's Revenue</p>

            <h2 className="mt-2 text-3xl font-bold">
              Rs. {summary.todayRevenue.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <FaShoppingCart className="mb-3 text-3xl text-purple-600" />

            <p className="text-gray-500">Total Orders</p>

            <h2 className="mt-2 text-3xl font-bold">
              {summary.totalOrders}
            </h2>
          </div>
        </div>

        {/* Revenue Chart */}
          <div className="rounded-xl bg-white p-6 shadow">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Revenue Analytics
                </h2>

                <p className="text-sm text-gray-500">
                  Revenue generated over time
                </p>
              </div>

             <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-[#2FA084]"
              >
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <RevenueChart data={monthlyRevenue} />
          </div>

        <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">
                Revenue by Product
            </h2>

            {productRevenue.length === 0 ? (
                <p className="text-gray-500">
                No revenue data available.
                </p>
            ) : (
                <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="border-b bg-gray-100">
                    <tr>
                        <th className="px-4 py-3 text-left">Product</th>

                        <th className="px-4 py-3 text-center">
                            Sold
                        </th>

                        <th className="px-4 py-3 text-right">
                            Unit Price
                        </th>

                        <th className="px-4 py-3 text-right">
                            Revenue
                        </th>

                        <th className="px-4 py-3 text-center">
                            Share
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {productRevenue.map((item) => (
                        <tr
                        key={item._id}
                        className="border-b hover:bg-gray-50"
                        >
                        <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="h-12 w-12 rounded-lg border object-cover"
                                onError={(e) => {
                                    console.log("Image failed:", item.image);

                                    e.target.src =
                                    "https://placehold.co/80x80?text=No+Image";
                                }}
                                />

                            <span>{item.name}</span>
                            </div>
                        </td>

                        <td className="px-4 py-3 text-center">
                            {item.quantitySold}
                        </td>

                        <td className="px-4 py-3 text-right">
                            Rs. {item.unitPrice?.toLocaleString()}
                        </td>

                        <td className="px-4 py-3 text-right font-semibold text-green-600">
                            Rs. {item.revenue.toLocaleString()}
                        </td>

                        <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                            <div
                                className="h-full rounded-full bg-green-500"
                                style={{
                                width: `${item.revenuePercentage}%`,
                                }}
                            />
                            </div>

                            <span className="min-w-[55px] text-right text-sm font-medium">
                            {item.revenuePercentage}%
                            </span>
                        </div>
                        </td>



                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
            </div>
      </div>
    </AdminLayout>
  );
}

export default AdminRevenue;