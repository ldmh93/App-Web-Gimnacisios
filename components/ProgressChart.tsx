"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ChartPoint {
  date: string;
  value: number;
}

interface ProgressChartProps {
  data: ChartPoint[];
  unit?: string;
  color?: string;
}

export function ProgressChart({
  data,
  unit = "kg",
  color = "var(--primary)",
}: ProgressChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        Registra tu primer dato para ver la gráfica.
      </div>
    );
  }

  return (
    <div className="h-56 w-full sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <defs>
            <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip
            formatter={(value) => [`${value} ${unit}`, ""]}
            separator=""
            contentStyle={{
              backgroundColor: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              color: "var(--popover-foreground)",
              fontSize: "0.8rem",
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fill="url(#chart-fill)"
            dot={{ r: 3, fill: color, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
