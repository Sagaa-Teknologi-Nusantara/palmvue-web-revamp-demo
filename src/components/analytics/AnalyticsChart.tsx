"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
const MAX_LABEL_LENGTH = 20;

function truncateLabel(label: string, max = MAX_LABEL_LENGTH): string {
  return label.length > max ? `${label.slice(0, max)}...` : label;
}

function BarXAxisTick({ x, y, payload }: { x: number; y: number; payload: { value: string } }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="end"
        fill="currentColor"
        fontSize={11}
        transform="rotate(-45)"
        className="text-muted-foreground"
      >
        <title>{payload.value}</title>
        {truncateLabel(payload.value)}
      </text>
    </g>
  );
}

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
  const isOthers = !!entry.payload.othersBreakdown;
  return (
    <div
      style={{
        backgroundColor: "var(--popover)",
        color: "var(--popover-foreground)",
        border: "1px solid var(--border)",
        borderRadius: "6px",
        padding: "8px 12px",
        pointerEvents: "none",
      }}
    >
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{entry.payload.name}</p>
      <p style={{ marginBottom: isOthers ? 4 : 0 }}>{entry.value.toLocaleString()}</p>
      {isOthers && (
        <p style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>Click for breakdown</p>
      )}
    </div>
  );
}

function OthersPopover({
  breakdown,
  total,
  position,
  onClose,
}: {
  breakdown: { name: string; value: number }[];
  total: number;
  position: { x: number; y: number };
  onClose: () => void;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <>
      <div
        style={{ position: "fixed", inset: 0, zIndex: 49 }}
        onClick={onClose}
      />
      <div
        ref={popoverRef}
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          zIndex: 50,
          backgroundColor: "var(--popover)",
          color: "var(--popover-foreground)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "12px 16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          maxHeight: "240px",
          minWidth: "180px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <p style={{ fontWeight: 600, fontSize: "13px" }}>Others</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <p style={{ fontWeight: 600, fontSize: "13px" }}>{total.toLocaleString()}</p>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 2,
                display: "flex",
                alignItems: "center",
                color: "var(--muted-foreground)",
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>
        <div
          style={{
            overflowY: "auto",
            flex: 1,
            borderTop: "1px solid var(--border)",
            paddingTop: 6,
          }}
        >
          {breakdown.map((item) => (
            <div
              key={item.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                fontSize: "12px",
                padding: "2px 0",
              }}
            >
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
              <span style={{ fontWeight: 500, flexShrink: 0 }}>{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function PieChartWithPopover({ pieData }: { pieData: PieDataEntry[] }) {
  const [popover, setPopover] = useState<{
    breakdown: { name: string; value: number }[];
    total: number;
    position: { x: number; y: number };
  } | null>(null);

  const handlePieClick = useCallback(
    (data: PieDataEntry, _index: number, e: React.MouseEvent) => {
      if (data.othersBreakdown) {
        setPopover({
          breakdown: data.othersBreakdown,
          total: data.value,
          position: { x: e.clientX + 8, y: e.clientY - 20 },
        });
      }
    },
    []
  );

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="35%"
            cy="50%"
            outerRadius="75%"
            onClick={handlePieClick}
            style={{ cursor: "pointer" }}
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
      {popover && (
        <OthersPopover
          breakdown={popover.breakdown}
          total={popover.total}
          position={popover.position}
          onClose={() => setPopover(null)}
        />
      )}
    </>
  );
}

function PieLegendContent({
  payload,
}: {
  payload?: { value: string; color: string }[];
}) {
  if (!payload) return null;
  const sorted = [...payload].sort((a, b) => {
    if (a.value === "Others") return 1;
    if (b.value === "Others") return -1;
    return a.value.localeCompare(b.value);
  });
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
      {sorted.map((entry) => (
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
          <BarChart data={chartData} margin={{ bottom: 60, left: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" interval={0} tick={BarXAxisTick} height={80} />
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
      return <PieChartWithPopover pieData={pieData} />;
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
          <BarChart data={chartData} margin={{ bottom: 60, left: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" interval={0} tick={BarXAxisTick} height={80} />
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
      return <PieChartWithPopover pieData={pieData} />;
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
