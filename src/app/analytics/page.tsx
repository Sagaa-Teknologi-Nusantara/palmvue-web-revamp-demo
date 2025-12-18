"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PageHeader } from "@/components/layout";
import {
  useEntityTypes,
  useEntities,
  useWorkflows,
  useWorkflowRecords,
} from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Boxes, Box, GitBranch, TrendingUp } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from "recharts";

// Brand-aligned colors derived from CSS variables
const COLORS = {
  primary: "#2E4236", // Deep Green
  primaryLight: "#e6f0ea",
  secondary: "#f2f4f3",
  accent: "#425e50", // Sidebar Ring color, good for secondary data
  success: "#22c55e",
  muted: "#cbd5e1", // Slate-300
  grid: "#e2e8f0",
  text: "#64748b",
  textDark: "#09090b",
};

const CHART_PALETTE = [
  "#2E4236", // Primary
  "#4A6B59", // Lighter Primary
  "#7B9E89", // Sage Green
  "#A3C4B3", // Light Sage
  "#CBD5E1", // Muted Blue Gray
];

const STATUS_COLORS = {
  not_started: "#e2e8f0", // Muted gray
  in_progress: "#fbbf24", // Yellow/Amber
  completed: "#22c55e", // Green
};

// Custom Tooltip Component for consistent Shadcn feel
interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    color: string;
    name: string;
    value: number;
    unit?: string;
  }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="border-border bg-popover animate-in fade-in-0 zoom-in-95 rounded-lg border px-3 py-2 shadow-md outline-none">
        <p className="text-popover-foreground mb-1 text-sm font-medium">
          {label}
        </p>
        <div className="flex flex-col gap-1">
          {payload.map((item, index) => (
            <div
              key={index}
              className="text-muted-foreground flex items-center gap-2 text-xs"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-foreground font-medium">{item.name}:</span>
              <span>
                {item.value}
                {item.unit ? ` ${item.unit}` : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Custom Legend Component for consistent styling
const CustomLegend = ({
  payload,
}: {
  payload?: { value: string; color: string }[];
}) => {
  if (!payload) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground text-sm font-medium">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const {
    entityTypes,
    entityTypeWorkflows,
    isLoaded: typesLoaded,
  } = useEntityTypes();
  const { entities, isLoaded: entitiesLoaded } = useEntities();
  const { workflows, isLoaded: workflowsLoaded } = useWorkflows();
  const { workflowRecords, isLoaded: recordsLoaded } = useWorkflowRecords();

  const isLoaded =
    typesLoaded && entitiesLoaded && workflowsLoaded && recordsLoaded;

  const entityDistributionData = useMemo(() => {
    const distribution: Record<string, number> = {};
    entities.forEach((entity) => {
      const typeName = entity.entity_type.name;
      distribution[typeName] = (distribution[typeName] || 0) + 1;
    });
    return Object.entries(distribution)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value); // Sort by magnitude
  }, [entities]);

  const workflowStatusData = useMemo(() => {
    const statusCounts = {
      not_started: 0,
      in_progress: 0,
      completed: 0,
    };
    workflowRecords.forEach((record) => {
      statusCounts[record.status] += 1;
    });
    return [
      {
        name: "Not Started",
        value: statusCounts.not_started,
        status: "not_started",
      },
      {
        name: "In Progress",
        value: statusCounts.in_progress,
        status: "in_progress",
      },
      { name: "Completed", value: statusCounts.completed, status: "completed" },
    ];
  }, [workflowRecords]);

  const entityTimelineData = useMemo(() => {
    const months: Record<string, number> = {};
    entities.forEach((entity) => {
      const date = new Date(entity.created_at);
      const monthKey = date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
      months[monthKey] = (months[monthKey] || 0) + 1;
    });
    // Ensure we have at least some data points for the visual
    if (Object.keys(months).length === 0) {
      return [{ month: "No Data", entities: 0 }];
    }

    return Object.entries(months)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([month, count]) => ({
        month,
        entities: count,
      }));
  }, [entities]);

  const entityTypeWorkflowData = useMemo(() => {
    return entityTypes.map((et) => ({
      name: et.name.length > 15 ? et.name.substring(0, 15) + "..." : et.name,
      workflows: entityTypeWorkflows[et.id]?.length || 0,
      entities: entities.filter((e) => e.entity_type_id === et.id).length,
    }));
  }, [entityTypes, entityTypeWorkflows, entities]);

  const completionRate = useMemo(() => {
    if (workflowRecords.length === 0) return 0;
    const completed = workflowRecords.filter(
      (r) => r.status === "completed",
    ).length;
    return Math.round((completed / workflowRecords.length) * 100);
  }, [workflowRecords]);

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Analytics"
          description="Insights across your platform"
        />
        <div className="grid gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Chart configuration defaults
  const chartProps = {
    fontFamily: "var(--font-geist-sans)",
    fontSize: 12,
  };

  return (
    <div className="animate-in fade-in-50 space-y-8 duration-500">
      <PageHeader
        title="Analytics"
        description="Comprehensive insights across your entity ecosystem"
      />

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Entities
            </CardTitle>
            <Box className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entities.length}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              Active across {entityTypes.length} types
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entity Types</CardTitle>
            <Boxes className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entityTypes.length}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              Defined schemas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Workflows
            </CardTitle>
            <GitBranch className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflowRecords.length}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              {workflows.length} definitions
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-muted-foreground mt-1 text-xs">
              Workflow success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Entity Distribution */}
        <Card className="col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle>Entity Distribution</CardTitle>
            <CardDescription>
              Breakdown of entities by their type definition
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            {entityDistributionData.length > 0 ? (
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={entityDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {entityDistributionData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_PALETTE[index % CHART_PALETTE.length]}
                          className="transition-opacity hover:opacity-80"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Legend content={<CustomLegend />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-muted-foreground flex h-[350px] items-center justify-center text-sm">
                No entities available to display
              </div>
            )}
          </CardContent>
        </Card>

        {/* Workflow Status */}
        <Card className="col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle>Workflow Status Overview</CardTitle>
            <CardDescription>
              Current state of all active workflow processes
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={workflowStatusData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke={COLORS.grid}
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: COLORS.textDark, ...chartProps }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: COLORS.secondary }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                    {workflowStatusData.map((entry) => (
                      <Cell
                        key={`cell-${entry.status}`}
                        fill={
                          STATUS_COLORS[
                            entry.status as keyof typeof STATUS_COLORS
                          ]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Entity Creation Timeline */}
        <Card className="col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle>Creation Timeline</CardTitle>
            <CardDescription>
              Volume of new entities created over time
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            {entityTimelineData.length > 0 ? (
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={entityTimelineData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="entityGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={COLORS.primary}
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.primary}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke={COLORS.grid}
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: COLORS.text, ...chartProps }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: COLORS.text, ...chartProps }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="entities"
                      stroke={COLORS.primary}
                      strokeWidth={2}
                      fill="url(#entityGradient)"
                      activeDot={{ r: 6, fill: COLORS.primary, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-muted-foreground flex h-[350px] items-center justify-center text-sm">
                No timeline data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Entity Types with Workflows */}
        <Card className="col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle>Type Composition</CardTitle>
            <CardDescription>
              Workflows and entities per defined type
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={entityTypeWorkflowData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={COLORS.grid}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: COLORS.text, ...chartProps }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: COLORS.text, ...chartProps }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: COLORS.secondary }}
                  />
                  <Legend content={<CustomLegend />} />
                  <Bar
                    dataKey="workflows"
                    name="Workflows"
                    fill={COLORS.primary}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar
                    dataKey="entities"
                    name="Entities"
                    fill={COLORS.accent}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
