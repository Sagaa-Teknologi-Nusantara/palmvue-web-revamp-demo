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
  "hsl(280, 67%, 55%)",
  "hsl(30, 90%, 50%)",
  "hsl(200, 70%, 50%)",
  "hsl(340, 75%, 55%)",
  "hsl(60, 70%, 45%)",
  "hsl(170, 60%, 40%)",
];

const MAX_PIE_SLICES = 5;

interface PieDataEntry {
  [key: string]: unknown;
  name: string;
  value: number;
  othersBreakdown?: { name: string; value: number }[];
}

function preparePieData(
  rawData: { name: string; value: number }[]
): PieDataEntry[] {
  if (rawData.length <= MAX_PIE_SLICES) return rawData;
  const sorted = [...rawData].sort((a, b) => b.value - a.value);
  const top: PieDataEntry[] = sorted.slice(0, MAX_PIE_SLICES);
  const othersItems = sorted.slice(MAX_PIE_SLICES);
  const othersValue = othersItems.reduce((sum, item) => sum + item.value, 0);
  if (othersValue > 0) {
    top.push({
      name: "Others",
      value: othersValue,
      othersBreakdown: othersItems,
    });
  }
  return top;
}

function PieTooltipContent({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: PieDataEntry }[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const entry = payload[0];
  const breakdown = entry.payload.othersBreakdown;
  return (
    <div
      style={{
        backgroundColor: "var(--popover)",
        color: "var(--popover-foreground)",
        border: "1px solid var(--border)",
        borderRadius: "6px",
        padding: "8px 12px",
        maxHeight: "200px",
        overflowY: "auto",
      }}
    >
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{entry.payload.name}</p>
      <p style={{ marginBottom: breakdown ? 6 : 0 }}>{entry.value.toLocaleString()}</p>
      {breakdown && (
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 4 }}>
          {breakdown.map((item) => (
            <div
              key={item.name}
              style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: "12px" }}
            >
              <span>{item.name}</span>
              <span style={{ fontWeight: 500 }}>{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PieLegendContent({
  payload,
}: {
  payload?: { value: string; color: string }[];
}) {
  if (!payload) return null;
  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        maxHeight: "180px",
        overflowY: "auto",
        fontSize: "12px",
      }}
    >
      {payload.map((entry) => (
        <li
          key={entry.value}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 4,
            whiteSpace: "nowrap",
          }}
          title={entry.value}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: entry.color,
              flexShrink: 0,
            }}
          />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: 120 }}>
            {entry.value}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function AnalyticsChart({ chartType, data }: AnalyticsChartProps) {
  if (data.type === "number") {
    return (
      <div className="flex items-start justify-start h-full">
        <span className="text-3xl font-bold text-primary">{data.value.toLocaleString()}</span>
      </div>
    );
  }

  if (data.type === "series") {
    if (!data.labels?.length || !data.values?.length) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No data available
        </div>
      );
    }

    const safeLength = Math.min(data.labels.length, data.values.length);
    const chartData = data.labels.slice(0, safeLength).map((label, idx) => ({
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
      const pieData = preparePieData(chartData);
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="35%"
              cy="50%"
              outerRadius="75%"
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltipContent />} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              content={<PieLegendContent />}
            />
          </PieChart>
        </ResponsiveContainer>
      );
    }
  }

  if (data.type === "grouped") {
    if (!data.data || Object.keys(data.data).length === 0) {
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
      const pieData = preparePieData(chartData);
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="35%"
              cy="50%"
              outerRadius="75%"
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltipContent />} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              content={<PieLegendContent />}
            />
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
