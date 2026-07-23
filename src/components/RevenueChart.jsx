import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { FaChartLine, FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

// Recharts renders raw SVG, so it needs real color values rather than
// Tailwind classes — this hex matches the theme's `accent` color exactly,
// so it stays visually identical to every other accent-colored element.
const ACCENT = "#2FA084";

// Flat, bordered tooltip built with the same classes as the rest of the
// app instead of Recharts' inline contentStyle — no box-shadow, no
// hardcoded corner radius.
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">
        Rs. {Number(payload[0].value).toLocaleString()}
      </p>
    </div>
  );
}

function RevenueChart({ data, headerAction }) {
  const hasData = data.length > 0;

  // Simple month-over-month change badge — a small but genuinely useful
  // signal for a revenue chart, using only colors already in the system.
  const trend = (() => {
    if (data.length < 2) return null;

    const previous = data[data.length - 2].revenue;
    const current = data[data.length - 1].revenue;

    if (!previous) return null;

    const change = ((current - previous) / previous) * 100;

    return {
      value: change,
      isUp: change >= 0,
    };
  })();

  return (
    <div className="rounded border border-slate-200 bg-white p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
            <FaChartLine />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Monthly Revenue</h2>
            <p className="text-sm text-slate-500">Revenue generated each month</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {trend && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                trend.isUp ? "bg-accent/10 text-accent" : "bg-rose-50 text-rose-700"
              }`}
            >
              {trend.isUp ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
              {trend.value >= 0 ? "+" : ""}
              {trend.value.toFixed(1)}% vs last month
            </span>
          )}

          {headerAction}
        </div>
      </div>

      {!hasData ? (
        <div className="flex h-[300px] flex-col items-center justify-center gap-3 rounded-md border border-dashed border-slate-300">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-100 text-slate-400">
            <FaChartLine />
          </div>
          <p className="text-sm text-slate-500">No revenue data available.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              {/* Flat fade, not a true gradient stop — a single tint of
                  accent fading to transparent, keeping the fill flat. */}
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCENT} stopOpacity={0.14} />
                <stop offset="100%" stopColor={ACCENT} stopOpacity={0.14} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />

            <YAxis
              tickFormatter={(value) =>
                value >= 1000000
                  ? `${(value / 1000000).toFixed(1)}M`
                  : `${(value / 1000).toFixed(0)}K`
              }
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#e2e8f0" }} />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke={ACCENT}
              strokeWidth={2}
              fill="url(#revenueFill)"
              animationDuration={800}
              dot={{ r: 4, strokeWidth: 2, fill: ACCENT, stroke: "#ffffff" }}
              activeDot={{ r: 6, fill: ACCENT, stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default RevenueChart;