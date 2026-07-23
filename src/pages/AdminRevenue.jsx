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
      setProductRevenue(data.productRevenue);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const summaryCards = [
    {
      label: "Total Revenue",
      value: `Rs. ${summary.totalRevenue.toLocaleString()}`,
      icon: <FaMoneyBillWave size={18} />,
    },
    {
      label: "Today's Revenue",
      value: `Rs. ${summary.todayRevenue.toLocaleString()}`,
      icon: <FaCalendarDay size={18} />,
    },
    {
      label: "Total Orders",
      value: summary.totalOrders,
      icon: <FaShoppingCart size={18} />,
    },
  ];

  if (loading) {
    return (
      <AdminLayout title="Revenue Analytics">
        <div className="rounded border border-slate-200 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            Loading revenue analytics...
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Please wait while we crunch the numbers.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Revenue Analytics">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="flex items-center justify-between rounded border border-slate-200 bg-white p-6"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.label}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {card.value}
                </h2>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart — the filter dropdown lives inside the chart's own
            header instead of a second wrapping card with a duplicate title */}
        <RevenueChart
          data={monthlyRevenue}
          headerAction={
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="cursor-pointer rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-accent"
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
            </select>
          }
        />

        {/* Revenue by Product */}
        <div className="rounded border border-slate-200 bg-white p-6">
          <h2 className="mb-5 text-lg font-bold text-slate-900">
            Revenue by Product
          </h2>

          {productRevenue.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-slate-300">
              <p className="text-sm text-slate-500">No revenue data available.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th className="px-5 py-3">Product</th>
                      <th className="px-5 py-3 text-center">Sold</th>
                      <th className="px-5 py-3 text-right">Unit Price</th>
                      <th className="px-5 py-3 text-right">Revenue</th>
                      <th className="px-5 py-3 text-center">Share</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {productRevenue.map((item) => (
                      <tr
                        key={item._id}
                        className="transition-colors hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white p-1">
                              <img
                                src={item.image}
                                alt={item.name}
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src =
                                    "https://placehold.co/80x80/FFFFFF/94A3B8?text=No+Image";
                                }}
                                className="h-full w-full object-contain"
                              />
                            </div>

                            <span className="text-sm font-medium text-slate-900">
                              {item.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-center text-sm text-slate-700">
                          {item.quantitySold}
                        </td>

                        <td className="px-5 py-4 text-right text-sm text-slate-700">
                          Rs. {item.unitPrice?.toLocaleString()}
                        </td>

                        <td className="px-5 py-4 text-right text-sm font-semibold text-accent">
                          Rs. {item.revenue.toLocaleString()}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-accent"
                                style={{ width: `${item.revenuePercentage}%` }}
                              />
                            </div>

                            <span className="min-w-[45px] text-right text-sm font-medium text-slate-700">
                              {item.revenuePercentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminRevenue;