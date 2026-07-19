import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function RevenueChart({ data }) {


  if (data.length === 0) {
  return (
    <div className="rounded border border-slate-200 bg-white p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">
          Monthly Revenue
        </h2>

        <p className="text-sm text-slate-500">
          Revenue generated each month
        </p>
      </div>

      <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed border-slate-300">
        <p className="text-sm text-slate-500">
          No revenue data available.
        </p>
      </div>
    </div>
  );
}

  return (
    <div className="rounded border border-slate-200 bg-white p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">
          Monthly Revenue
        </h2>

        <p className="text-sm text-slate-500">
          Revenue generated each month
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2FA084" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#2FA084" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="5 5"
            vertical={false}
            stroke="#e2e8f0"
          />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 13 }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            tickFormatter={(value) =>
              value >= 1000000
                ? `${(value / 1000000).toFixed(1)}M`
                : `${(value / 1000).toFixed(0)}K`
            }
            tick={{ fontSize: 13 }}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
          labelFormatter={(label) => `Month: ${label}`}
            formatter={(value) => [
              `Rs. ${Number(value).toLocaleString()}`,
              "Revenue",
            ]}
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#2FA084"
            strokeWidth={3}
            fill="url(#revenueGradient)"
            animationDuration={1200}
            dot={{
              r: 5,
              strokeWidth: 2,
              fill: "#2FA084",
            }}
            activeDot={{
              r: 7,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;