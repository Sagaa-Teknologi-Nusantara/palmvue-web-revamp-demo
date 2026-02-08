"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AnalyticsChartType,AnalyticsQueryData } from "@/api/types/analytics";

interface AnalyticsChartProps {
  chartType: AnalyticsChartType;
  data: AnalyticsQueryData;
}

const COLORS = [
  "var(--primary)",
  "var(--secondary)",
  "var(--accent)",
  "hsl(142, 71%, 45%)",
  "hsl(280, 100%, 70%)",
  "hsl(30, 100%, 50%)",
];

export function AnalyticsChart({ chartType, data }: AnalyticsChartProps) {
  if (data.type === "number") {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-5xl font-bold text-primary">{data.value.toLocaleString()}</span>
      </div>
    );
  }

  if (data.type === "series") {
    if (!data.labels || !data.values) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No data available
        </div>
      );
    }

    const chartData = data.labels.map((label, idx) => ({
      name: label,
      value: data.values[idx],
    }));

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--popover)",
                color: "var(--popover-foreground)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={{ fill: "var(--primary)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--popover)",
                color: "var(--popover-foreground)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "pie") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              label
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--popover)",
                color: "var(--popover-foreground)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }
  }

  if (data.type === "grouped") {
    if (!data.data) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No data available
        </div>
      );
    }

    const chartData = Object.entries(data.data).map(([name, value]) => ({
      name,
      value,
    }));

    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--popover)",
                color: "var(--popover-foreground)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "pie") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              label
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--popover)",
                color: "var(--popover-foreground)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--popover)",
                color: "var(--popover-foreground)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={{ fill: "var(--primary)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  }

  return (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      Unable to render chart
    </div>
  );
}
