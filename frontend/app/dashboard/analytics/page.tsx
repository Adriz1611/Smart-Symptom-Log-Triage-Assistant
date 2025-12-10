"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import apiClient from "@/lib/api/client";
import { useTheme } from "@/lib/theme/theme-context";
import Button3D from "@/components/ui/Button3D";
import Select3D from "@/components/ui/Select3D";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";

interface Symptom {
  id: string;
  symptomName: string;
  bodyLocation?: string;
  severity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  startedAt: string;
}

const COLORS = {
  blue: "#3b82f6",
  green: "#10b981",
  red: "#ef4444",
  amber: "#f59e0b",
  purple: "#a855f7",
  teal: "#14b8a6",
  pink: "#ec4899",
  indigo: "#6366f1",
  orange: "#f97316",
  gray: "#6b7280",
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: COLORS.blue,
  IMPROVING: COLORS.amber,
  WORSENING: COLORS.red,
  RESOLVED: COLORS.green,
  MONITORING: COLORS.gray,
};

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [timeRange, setTimeRange] = useState("9999"); // Default to All Time (for base data)
  const [trendRange, setTrendRange] = useState("30"); // Unified trend chart range

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/symptoms?limit=1000");
      const allSymptoms = response.data?.data?.symptoms || [];

      // Filter by time range
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange));
      const filteredSymptoms = allSymptoms.filter(
        (s: Symptom) => new Date(s.createdAt) >= cutoffDate
      );

      setSymptoms(filteredSymptoms);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate comprehensive analytics
  const analytics = useMemo(() => {
    if (symptoms.length === 0) return null;

    // Basic stats
    const totalSymptoms = symptoms.length;
    const activeSymptoms = symptoms.filter((s) => s.status === "ACTIVE").length;
    const resolvedSymptoms = symptoms.filter(
      (s) => s.status === "RESOLVED"
    ).length;
    const improvingSymptoms = symptoms.filter(
      (s) => s.status === "IMPROVING"
    ).length;
    const worseningSymptoms = symptoms.filter(
      (s) => s.status === "WORSENING"
    ).length;
    const avgSeverity =
      symptoms.reduce((sum, s) => sum + s.severity, 0) / totalSymptoms;

    // Status distribution
    const statusDistribution = [
      { name: "Active", value: activeSymptoms, color: STATUS_COLORS.ACTIVE },
      {
        name: "Improving",
        value: improvingSymptoms,
        color: STATUS_COLORS.IMPROVING,
      },
      {
        name: "Worsening",
        value: worseningSymptoms,
        color: STATUS_COLORS.WORSENING,
      },
      {
        name: "Resolved",
        value: resolvedSymptoms,
        color: STATUS_COLORS.RESOLVED,
      },
      {
        name: "Monitoring",
        value: symptoms.filter((s) => s.status === "MONITORING").length,
        color: STATUS_COLORS.MONITORING,
      },
    ].filter((item) => item.value > 0);

    // Severity distribution
    const severityDistribution = [
      {
        range: "Low (1-3)",
        count: symptoms.filter((s) => s.severity >= 1 && s.severity <= 3)
          .length,
      },
      {
        range: "Medium (4-6)",
        count: symptoms.filter((s) => s.severity >= 4 && s.severity <= 6)
          .length,
      },
      {
        range: "High (7-10)",
        count: symptoms.filter((s) => s.severity >= 7 && s.severity <= 10)
          .length,
      },
    ];

    // Daily trend - use custom range
    const generateDailyTrend = (days: number) => {
      const dailyTrend = [];
      const today = new Date();
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        const daySymptoms = symptoms.filter(
          (s) => new Date(s.createdAt).toISOString().split("T")[0] === dateStr
        );
        const avgDaySeverity =
          daySymptoms.length > 0
            ? daySymptoms.reduce((sum, s) => sum + s.severity, 0) /
              daySymptoms.length
            : 0;

        dailyTrend.push({
          date: `${date.getMonth() + 1}/${date.getDate()}`,
          count: daySymptoms.length,
          avgSeverity: Math.round(avgDaySeverity * 10) / 10,
          active: daySymptoms.filter((s) => s.status === "ACTIVE").length,
        });
      }
      return dailyTrend;
    };

    const dailyTrend = generateDailyTrend(parseInt(trendRange));
    const severityDailyTrend = generateDailyTrend(parseInt(trendRange));

    // Status timeline - use custom range
    const generateStatusTimeline = (days: number) => {
      const timeline = [];
      const today = new Date();
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        const daySymptoms = symptoms.filter(
          (s) => new Date(s.createdAt).toISOString().split("T")[0] === dateStr
        );
        timeline.push({
          date: `${date.getMonth() + 1}/${date.getDate()}`,
          Active: daySymptoms.filter((s) => s.status === "ACTIVE").length,
          Improving: daySymptoms.filter((s) => s.status === "IMPROVING").length,
          Worsening: daySymptoms.filter((s) => s.status === "WORSENING").length,
          Resolved: daySymptoms.filter((s) => s.status === "RESOLVED").length,
        });
      }
      return timeline;
    };

    const statusTimeline = generateStatusTimeline(parseInt(trendRange));

    // Body location stats
    const locationMap = new Map<string, number>();
    symptoms.forEach((s) => {
      const location = s.bodyLocation || "Unknown";
      locationMap.set(location, (locationMap.get(location) || 0) + 1);
    });
    const bodyLocationStats = Array.from(locationMap.entries())
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Monthly trend
    const monthMap = new Map<
      string,
      { count: number; totalSeverity: number }
    >();
    symptoms.forEach((s) => {
      const date = new Date(s.createdAt);
      const monthKey = `${date.toLocaleString("default", {
        month: "short",
      })} ${date.getFullYear()}`;
      const current = monthMap.get(monthKey) || { count: 0, totalSeverity: 0 };
      monthMap.set(monthKey, {
        count: current.count + 1,
        totalSeverity: current.totalSeverity + s.severity,
      });
    });
    const monthlyTrend = Array.from(monthMap.entries())
      .map(([month, data]) => ({
        month,
        count: data.count,
        avgSeverity: Math.round((data.totalSeverity / data.count) * 10) / 10,
      }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.month.split(" ");
        const [bMonth, bYear] = b.month.split(" ");
        const aDate = new Date(`${aMonth} 1, ${aYear}`);
        const bDate = new Date(`${bMonth} 1, ${bYear}`);
        return aDate.getTime() - bDate.getTime();
      });

    // Symptom type frequency
    const symptomTypeMap = new Map<string, number>();
    symptoms.forEach((s) => {
      const type = s.symptomName.toLowerCase();
      symptomTypeMap.set(type, (symptomTypeMap.get(type) || 0) + 1);
    });
    const topSymptoms = Array.from(symptomTypeMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Recovery rate (resolved / total)
    const recoveryRate = ((resolvedSymptoms / totalSymptoms) * 100).toFixed(1);

    return {
      totalSymptoms,
      activeSymptoms,
      resolvedSymptoms,
      improvingSymptoms,
      worseningSymptoms,
      avgSeverity: Math.round(avgSeverity * 10) / 10,
      recoveryRate,
      statusDistribution,
      severityDistribution,
      dailyTrend,
      severityDailyTrend,
      bodyLocationStats,
      monthlyTrend,
      topSymptoms,
      statusTimeline,
    };
  }, [symptoms, trendRange]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="p-3 border rounded-lg shadow-lg transition-colors duration-200"
          style={{
            background: theme === "dark" ? "#1a1d29" : "white",
            border:
              theme === "dark"
                ? "1px solid #2d3748"
                : "1px solid rgb(229, 231, 235)",
          }}
        >
          <p
            className="font-semibold transition-colors duration-200"
            style={{ color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)" }}
          >
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{
        background: theme === "dark" ? "#0a0b0f" : "rgb(249, 250, 251)",
      }}
    >
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <Link href="/dashboard" className="inline-block mb-2 sm:mb-3">
            <Button3D variant="white" size="sm">
              <span className="flex items-center text-xs sm:text-sm">
                <span className="mr-1 sm:mr-2">←</span>
                <span className="hidden xs:inline">Back to Dashboard</span>
                <span className="xs:hidden">Back</span>
              </span>
            </Button3D>
          </Link>
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-black mb-1.5 sm:mb-2 transition-colors duration-200"
            style={{ color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)" }}
          >
            📊 <span className="hidden sm:inline">Health </span>Analytics
          </h1>
          <p
            className="text-sm sm:text-base transition-colors duration-200"
            style={{ color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)" }}
          >
            <span className="hidden sm:inline">
              Comprehensive insights into your{" "}
            </span>
            <span className="sm:hidden">Your </span>symptom patterns
            <span className="hidden sm:inline"> and health trends</span>
          </p>
        </div>

        {/* Control Panel */}
        <div className="mb-4 sm:mb-6 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Data Range Filter */}
          <div
            className="rounded-xl p-3 sm:p-4 transition-all duration-200"
            style={{
              background:
                theme === "dark"
                  ? "linear-gradient(135deg, #1a1d29 0%, #252937 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
              border:
                theme === "dark" ? "3px solid #2d3748" : "3px solid #242622",
              boxShadow:
                theme === "dark" ? "0 6px 0 #2d3748" : "0 6px 0 #242622",
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl">🗓️</span>
                <div>
                  <span
                    className="text-xs sm:text-sm font-black uppercase tracking-widest transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                    }}
                  >
                    Data Range
                  </span>
                  <p
                    className="text-[10px] sm:text-xs font-bold transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                    }}
                  >
                    Overall data to analyze
                  </p>
                </div>
              </div>
              <Select3D
                value={timeRange}
                onChange={setTimeRange}
                options={[
                  { value: "30", label: "Last 30 Days" },
                  { value: "90", label: "Last 90 Days" },
                  { value: "365", label: "Last Year" },
                  { value: "9999", label: "All Time" },
                ]}
                className="w-full sm:w-48"
              />
            </div>
          </div>

          {/* Trend Chart Time Period */}
          <div
            className="rounded-xl p-3 sm:p-4 transition-all duration-200"
            style={{
              background:
                theme === "dark"
                  ? "linear-gradient(135deg, #1a1d29 0%, #252937 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
              border:
                theme === "dark" ? "3px solid #2d3748" : "3px solid #242622",
              boxShadow:
                theme === "dark" ? "0 6px 0 #2d3748" : "0 6px 0 #242622",
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl">📊</span>
                <div>
                  <span
                    className="text-xs sm:text-sm font-black uppercase tracking-widest transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                    }}
                  >
                    Trend Chart Period
                  </span>
                  <p
                    className="text-[10px] sm:text-xs font-bold transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                    }}
                  >
                    Time granularity for trends
                  </p>
                </div>
              </div>
              <Select3D
                value={trendRange}
                onChange={setTrendRange}
                options={[
                  { value: "7", label: "Last 7 Days" },
                  { value: "14", label: "Last 14 Days" },
                  { value: "30", label: "Last 30 Days" },
                  { value: "60", label: "Last 60 Days" },
                  { value: "90", label: "Last 90 Days" },
                ]}
                className="w-full sm:w-48"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48 sm:h-64">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        ) : !analytics ? (
          <div
            className="rounded-lg p-6 sm:p-8 md:p-12 text-center transition-colors duration-200"
            style={{
              background: theme === "dark" ? "#1a1d29" : "white",
              border:
                theme === "dark"
                  ? "1px solid #2d3748"
                  : "1px solid rgb(229, 231, 235)",
            }}
          >
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
              style={{
                background: theme === "dark" ? "#2d3748" : "rgb(243, 244, 246)",
              }}
            >
              <span className="text-2xl sm:text-3xl md:text-4xl">📊</span>
            </div>
            <p
              className="text-sm sm:text-base md:text-lg mb-3 sm:mb-4 transition-colors duration-200"
              style={{
                color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
              }}
            >
              No data available for the selected time range
            </p>
            <Link
              href="/dashboard"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
            >
              Go back to dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Monthly Overview - Full Year View at Top */}
            {analytics.monthlyTrend.length > 1 && (
              <div
                className="rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-200"
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg, #1a1d29 0%, #252937 100%)"
                      : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
                  border:
                    theme === "dark"
                      ? "3px solid #2d3748"
                      : "3px solid #242622",
                  boxShadow:
                    theme === "dark" ? "0 6px 0 #2d3748" : "0 6px 0 #242622",
                }}
              >
                <div className="mb-4 sm:mb-6">
                  <h2
                    className="text-lg sm:text-xl md:text-2xl font-black flex items-center gap-2 sm:gap-3 transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                    }}
                  >
                    <span className="text-xl sm:text-2xl md:text-3xl">📅</span>
                    Monthly Overview
                  </h2>
                  <p
                    className="text-xs sm:text-sm font-bold mt-1.5 sm:mt-2 ml-7 sm:ml-10 transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                    }}
                  >
                    <span className="hidden sm:inline">
                      Long-term trends across all months •{" "}
                    </span>
                    Data Range:{" "}
                    <span className="font-black text-purple-600">
                      {timeRange === "9999"
                        ? "All Time"
                        : `Last ${timeRange} Days`}
                    </span>
                  </p>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <ComposedChart data={analytics.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      stroke="#6b7280"
                      style={{ fontSize: "10px" }}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="#6b7280"
                      style={{ fontSize: "10px" }}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#6b7280"
                      style={{ fontSize: "10px" }}
                      tick={{ fontSize: 10 }}
                      domain={[0, 10]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar
                      yAxisId="left"
                      dataKey="count"
                      fill={COLORS.blue}
                      name="Symptom Count"
                      radius={[8, 8, 0, 0]}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgSeverity"
                      stroke={COLORS.red}
                      strokeWidth={3}
                      name="Avg Severity"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              <div
                className="rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-200 hover:-translate-y-1"
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg, #1a1d29 0%, #252937 100%)"
                      : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
                  border:
                    theme === "dark"
                      ? "3px solid #2d3748"
                      : "3px solid #242622",
                  boxShadow:
                    theme === "dark" ? "0 6px 0 #2d3748" : "0 6px 0 #242622",
                }}
              >
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span
                    className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-widest transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                    }}
                  >
                    Total Symptoms
                  </span>
                  <span className="text-lg sm:text-xl md:text-2xl">📊</span>
                </div>
                <div
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black transition-colors duration-200"
                  style={{
                    color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                  }}
                >
                  {analytics.totalSymptoms}
                </div>
                <p
                  className="text-[10px] sm:text-xs font-bold mt-0.5 sm:mt-1 transition-colors duration-200"
                  style={{
                    color: theme === "dark" ? "#6b7280" : "rgb(107, 114, 128)",
                  }}
                >
                  All recorded
                </p>
              </div>

              <div
                className="rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-200 hover:-translate-y-1"
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg, #1a1d29 0%, #252937 100%)"
                      : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
                  border:
                    theme === "dark"
                      ? "3px solid #2d3748"
                      : "3px solid #242622",
                  boxShadow:
                    theme === "dark" ? "0 6px 0 #2d3748" : "0 6px 0 #242622",
                }}
              >
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-widest text-blue-600">
                    Active Now
                  </span>
                  <span className="text-lg sm:text-xl md:text-2xl">⚡</span>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-blue-600">
                  {analytics.activeSymptoms}
                </div>
                <p
                  className="text-[10px] sm:text-xs font-bold mt-0.5 sm:mt-1 transition-colors duration-200"
                  style={{
                    color: theme === "dark" ? "#6b7280" : "rgb(107, 114, 128)",
                  }}
                >
                  {(
                    (analytics.activeSymptoms / analytics.totalSymptoms) *
                    100
                  ).toFixed(1)}
                  % of total
                </p>
              </div>

              <div
                className="rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-200 hover:-translate-y-1"
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg, #1a1d29 0%, #252937 100%)"
                      : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
                  border:
                    theme === "dark"
                      ? "3px solid #2d3748"
                      : "3px solid #242622",
                  boxShadow:
                    theme === "dark" ? "0 6px 0 #2d3748" : "0 6px 0 #242622",
                }}
              >
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-widest text-orange-600">
                    Avg Severity
                  </span>
                  <span className="text-lg sm:text-xl md:text-2xl">🌡️</span>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-orange-600">
                  {analytics.avgSeverity}
                  <span
                    className="text-lg font-bold transition-colors duration-200"
                    style={{
                      color:
                        theme === "dark" ? "#6b7280" : "rgb(107, 114, 128)",
                    }}
                  >
                    /10
                  </span>
                </div>
                <div
                  className="w-full rounded-full h-2.5 mt-2 transition-colors duration-200"
                  style={{
                    background:
                      theme === "dark" ? "#2d3748" : "rgb(229, 231, 235)",
                  }}
                >
                  <div
                    className="bg-orange-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${(analytics.avgSeverity / 10) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div
                className="rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-200 hover:-translate-y-1"
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg, #1a1d29 0%, #252937 100%)"
                      : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
                  border:
                    theme === "dark"
                      ? "3px solid #2d3748"
                      : "3px solid #242622",
                  boxShadow:
                    theme === "dark" ? "0 6px 0 #2d3748" : "0 6px 0 #242622",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-green-600">
                    Recovery Rate
                  </span>
                  <span className="text-lg sm:text-xl md:text-2xl">✅</span>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-green-600">
                  {analytics.recoveryRate}%
                </div>
                <p
                  className="text-xs font-bold mt-1 transition-colors duration-200"
                  style={{
                    color: theme === "dark" ? "#6b7280" : "rgb(107, 114, 128)",
                  }}
                >
                  {analytics.resolvedSymptoms} resolved
                </p>
              </div>
            </div>

            {/* Symptom Trend Over Time */}
            <div
              className="rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-200"
              style={{
                background:
                  theme === "dark"
                    ? "linear-gradient(135deg, #1a1d29 0%, #252937 100%)"
                    : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
                border:
                  theme === "dark" ? "3px solid #2d3748" : "3px solid #242622",
                boxShadow:
                  theme === "dark" ? "0 6px 0 #2d3748" : "0 6px 0 #242622",
              }}
            >
              <div className="mb-3 sm:mb-4">
                <h2
                  className="text-base sm:text-lg md:text-xl font-black flex items-center gap-2 transition-colors duration-200"
                  style={{
                    color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                  }}
                >
                  <span className="text-lg sm:text-xl md:text-2xl">📈</span>
                  Symptom Count Trend
                </h2>
                <p
                  className="text-xs font-bold mt-1 ml-7 sm:ml-8 md:ml-9 transition-colors duration-200"
                  style={{
                    color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                  }}
                >
                  Time Period:{" "}
                  <span className="font-black text-blue-600">
                    Last {trendRange} Days
                  </span>
                </p>
              </div>
              <ResponsiveContainer
                width="100%"
                height={250}
                className="sm:h-[280px]! md:h-80!"
              >
                <AreaChart data={analytics.dailyTrend}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={COLORS.blue}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.blue}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke={COLORS.blue}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                    name="Symptom Count"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Status Distribution & Severity Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              <div
                className="rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-200"
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg, #1a1d29 0%, #252937 100%)"
                      : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
                  border:
                    theme === "dark"
                      ? "3px solid #2d3748"
                      : "3px solid #242622",
                  boxShadow:
                    theme === "dark" ? "0 6px 0 #2d3748" : "0 6px 0 #242622",
                }}
              >
                <div className="mb-3 sm:mb-4">
                  <h2
                    className="text-base sm:text-lg md:text-xl font-black flex items-center gap-2 transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                    }}
                  >
                    <span className="text-lg sm:text-xl md:text-2xl">🎯</span>
                    Status Distribution
                  </h2>
                  <p
                    className="text-xs mt-1 ml-7 sm:ml-8 md:ml-9 transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                    }}
                  >
                    Data Range:{" "}
                    <span className="font-semibold text-purple-600">
                      {timeRange === "9999"
                        ? "All Time"
                        : `Last ${timeRange} Days`}
                    </span>
                  </p>
                </div>
                <ResponsiveContainer
                  width="100%"
                  height={220}
                  className="sm:h-[260px]! md:h-[300px]!"
                >
                  <PieChart>
                    <Pie
                      data={analytics.statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div
                className="rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-200"
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg, #1a1d29 0%, #252937 100%)"
                      : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
                  border:
                    theme === "dark"
                      ? "3px solid #2d3748"
                      : "3px solid #242622",
                  boxShadow:
                    theme === "dark" ? "0 6px 0 #2d3748" : "0 6px 0 #242622",
                }}
              >
                <div className="mb-3 sm:mb-4">
                  <h2
                    className="text-base sm:text-lg md:text-xl font-black flex items-center gap-2 transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                    }}
                  >
                    <span className="text-lg sm:text-xl md:text-2xl">🌡️</span>
                    Severity Levels
                  </h2>
                  <p
                    className="text-xs font-bold mt-1 ml-7 sm:ml-8 md:ml-9 transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                    }}
                  >
                    Data Range:{" "}
                    <span className="font-black text-orange-600">
                      {timeRange === "9999"
                        ? "All Time"
                        : `Last ${timeRange} Days`}
                    </span>
                  </p>
                </div>
                <ResponsiveContainer
                  width="100%"
                  height={220}
                  className="sm:h-[260px]! md:h-[300px]!"
                >
                  <BarChart data={analytics.severityDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="range"
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="count"
                      fill={COLORS.orange}
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Average Severity Over Time */}
            <div
              className="rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-200"
              style={{
                background:
                  theme === "dark"
                    ? "linear-gradient(135deg, #1a1d29 0%, #252937 100%)"
                    : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
                border:
                  theme === "dark" ? "3px solid #2d3748" : "3px solid #242622",
                boxShadow:
                  theme === "dark" ? "0 6px 0 #2d3748" : "0 6px 0 #242622",
              }}
            >
              <div className="mb-3 sm:mb-4">
                <h2
                  className="text-base sm:text-lg md:text-xl font-black flex items-center gap-2 transition-colors duration-200"
                  style={{
                    color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                  }}
                >
                  <span className="text-lg sm:text-xl md:text-2xl">📊</span>
                  Average Severity Trend
                </h2>
                <p
                  className="text-xs font-bold mt-1 ml-7 sm:ml-8 md:ml-9 transition-colors duration-200"
                  style={{
                    color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                  }}
                >
                  Time Period:{" "}
                  <span className="font-black text-red-600">
                    Last {trendRange} Days
                  </span>
                </p>
              </div>
              <ResponsiveContainer
                width="100%"
                height={250}
                className="sm:h-[280px]! md:h-80!"
              >
                <LineChart data={analytics.severityDailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    domain={[0, 10]}
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgSeverity"
                    stroke={COLORS.red}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Avg Severity"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Status Timeline - Stacked Area */}
            <div
              className="rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-200"
              style={{
                background:
                  theme === "dark"
                    ? "linear-gradient(135deg, #1a1d29 0%, #252937 100%)"
                    : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
                border:
                  theme === "dark" ? "3px solid #2d3748" : "3px solid #242622",
                boxShadow:
                  theme === "dark" ? "0 6px 0 #2d3748" : "0 6px 0 #242622",
              }}
            >
              <div className="mb-3 sm:mb-4">
                <h2
                  className="text-base sm:text-lg md:text-xl font-black flex items-center gap-2 transition-colors duration-200"
                  style={{
                    color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                  }}
                >
                  <span className="text-lg sm:text-xl md:text-2xl">⏱️</span>
                  Status Timeline Evolution
                </h2>
                <p
                  className="text-xs font-bold mt-1 ml-7 sm:ml-8 md:ml-9 transition-colors duration-200"
                  style={{
                    color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                  }}
                >
                  Time Period:{" "}
                  <span className="font-black text-teal-600">
                    Last {trendRange} Days
                  </span>
                </p>
              </div>
              <ResponsiveContainer
                width="100%"
                height={250}
                className="sm:h-[280px]! md:h-80!"
              >
                <AreaChart data={analytics.statusTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="Active"
                    stackId="1"
                    stroke={STATUS_COLORS.ACTIVE}
                    fill={STATUS_COLORS.ACTIVE}
                  />
                  <Area
                    type="monotone"
                    dataKey="Improving"
                    stackId="1"
                    stroke={STATUS_COLORS.IMPROVING}
                    fill={STATUS_COLORS.IMPROVING}
                  />
                  <Area
                    type="monotone"
                    dataKey="Worsening"
                    stackId="1"
                    stroke={STATUS_COLORS.WORSENING}
                    fill={STATUS_COLORS.WORSENING}
                  />
                  <Area
                    type="monotone"
                    dataKey="Resolved"
                    stackId="1"
                    stroke={STATUS_COLORS.RESOLVED}
                    fill={STATUS_COLORS.RESOLVED}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Top Body Locations & Top Symptoms */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              <div
                className="rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-200"
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg, #1a1d29 0%, #252937 100%)"
                      : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
                  border:
                    theme === "dark"
                      ? "3px solid #2d3748"
                      : "3px solid #242622",
                  boxShadow:
                    theme === "dark" ? "0 6px 0 #2d3748" : "0 6px 0 #242622",
                }}
              >
                <div className="mb-3 sm:mb-4">
                  <h2
                    className="text-base sm:text-lg md:text-xl font-black flex items-center gap-2 transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                    }}
                  >
                    <span className="text-lg sm:text-xl md:text-2xl">📍</span>
                    Most Affected Areas
                  </h2>
                  <p
                    className="text-xs font-bold mt-1 ml-7 sm:ml-8 md:ml-9 transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                    }}
                  >
                    Data Range:{" "}
                    <span className="font-black text-violet-600">
                      {timeRange === "9999"
                        ? "All Time"
                        : `Last ${timeRange} Days`}
                    </span>
                  </p>
                </div>
                <ResponsiveContainer
                  width="100%"
                  height={250}
                  className="sm:h-[280px]! md:h-80!"
                >
                  <BarChart
                    data={analytics.bodyLocationStats}
                    layout="vertical"
                    margin={{ left: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      type="number"
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="location"
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                      width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="count"
                      fill={COLORS.purple}
                      radius={[0, 8, 8, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div
                className="rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-200"
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg, #1a1d29 0%, #252937 100%)"
                      : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
                  border:
                    theme === "dark"
                      ? "3px solid #2d3748"
                      : "3px solid #242622",
                  boxShadow:
                    theme === "dark" ? "0 6px 0 #2d3748" : "0 6px 0 #242622",
                }}
              >
                <div className="mb-3 sm:mb-4">
                  <h2
                    className="text-base sm:text-lg md:text-xl font-black flex items-center gap-2 transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                    }}
                  >
                    <span className="text-lg sm:text-xl md:text-2xl">🩺</span>
                    Most Common Symptoms
                  </h2>
                  <p
                    className="text-xs font-bold mt-1 ml-7 sm:ml-8 md:ml-9 transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                    }}
                  >
                    Data Range:{" "}
                    <span className="font-black text-cyan-600">
                      {timeRange === "9999"
                        ? "All Time"
                        : `Last ${timeRange} Days`}
                    </span>
                  </p>
                </div>
                <ResponsiveContainer
                  width="100%"
                  height={250}
                  className="sm:h-[280px]! md:h-80!"
                >
                  <BarChart
                    data={analytics.topSymptoms}
                    layout="vertical"
                    margin={{ left: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      type="number"
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                      width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="count"
                      fill={COLORS.teal}
                      radius={[0, 8, 8, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Key Insights */}
            <div
              className="rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-200"
              style={{
                background:
                  theme === "dark"
                    ? "linear-gradient(135deg, #1a1d29 0%, #252937 100%)"
                    : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
                border:
                  theme === "dark" ? "3px solid #2d3748" : "3px solid #242622",
                boxShadow:
                  theme === "dark" ? "0 6px 0 #2d3748" : "0 6px 0 #242622",
              }}
            >
              <h2
                className="text-base sm:text-lg md:text-xl lg:text-2xl font-black mb-3 sm:mb-4 flex items-center gap-2 transition-colors duration-200"
                style={{
                  color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                }}
              >
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
                  💡
                </span>
                Key Insights
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div
                  className="rounded-xl p-3 sm:p-4 transition-all duration-200 hover:-translate-y-1"
                  style={{
                    background:
                      theme === "dark"
                        ? "linear-gradient(135deg, #252937 0%, #2d3748 100%)"
                        : "linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)",
                    border:
                      theme === "dark"
                        ? "3px solid #2d3748"
                        : "3px solid #242622",
                    boxShadow:
                      theme === "dark" ? "0 4px 0 #2d3748" : "0 4px 0 #242622",
                  }}
                >
                  <p
                    className="text-xs sm:text-sm font-black uppercase tracking-widest mb-1 transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                    }}
                  >
                    Most Affected Area
                  </p>
                  <p
                    className="text-sm sm:text-base md:text-lg font-black capitalize transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                    }}
                  >
                    {analytics.bodyLocationStats[0]?.location || "N/A"}{" "}
                    <span
                      className="text-sm font-bold transition-colors duration-200"
                      style={{
                        color:
                          theme === "dark" ? "#6b7280" : "rgb(107, 114, 128)",
                      }}
                    >
                      ({analytics.bodyLocationStats[0]?.count || 0} symptoms)
                    </span>
                  </p>
                </div>
                <div
                  className="rounded-xl p-3 sm:p-4 transition-all duration-200 hover:-translate-y-1"
                  style={{
                    background:
                      theme === "dark"
                        ? "linear-gradient(135deg, #252937 0%, #2d3748 100%)"
                        : "linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)",
                    border:
                      theme === "dark"
                        ? "3px solid #2d3748"
                        : "3px solid #242622",
                    boxShadow:
                      theme === "dark" ? "0 4px 0 #2d3748" : "0 4px 0 #242622",
                  }}
                >
                  <p
                    className="text-xs sm:text-sm font-black uppercase tracking-widest mb-1 transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                    }}
                  >
                    Most Common Symptom
                  </p>
                  <p
                    className="text-sm sm:text-base md:text-lg font-black capitalize transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                    }}
                  >
                    {analytics.topSymptoms[0]?.name || "N/A"}{" "}
                    <span
                      className="text-sm font-bold transition-colors duration-200"
                      style={{
                        color:
                          theme === "dark" ? "#6b7280" : "rgb(107, 114, 128)",
                      }}
                    >
                      ({analytics.topSymptoms[0]?.count || 0} occurrences)
                    </span>
                  </p>
                </div>
                <div
                  className="rounded-xl p-3 sm:p-4 transition-all duration-200 hover:-translate-y-1"
                  style={{
                    background:
                      theme === "dark"
                        ? "linear-gradient(135deg, #252937 0%, #2d3748 100%)"
                        : "linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)",
                    border:
                      theme === "dark"
                        ? "3px solid #2d3748"
                        : "3px solid #242622",
                    boxShadow:
                      theme === "dark" ? "0 4px 0 #2d3748" : "0 4px 0 #242622",
                  }}
                >
                  <p
                    className="text-xs sm:text-sm font-black uppercase tracking-widest mb-1 transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                    }}
                  >
                    Health Trend
                  </p>
                  <p className="text-sm sm:text-base md:text-lg font-black">
                    {analytics.improvingSymptoms >
                    analytics.worseningSymptoms ? (
                      <span className="text-green-600">
                        Improving 📈 ({analytics.improvingSymptoms} symptoms)
                      </span>
                    ) : analytics.worseningSymptoms >
                      analytics.improvingSymptoms ? (
                      <span className="text-red-600">
                        Needs Attention ⚠️ ({analytics.worseningSymptoms}{" "}
                        worsening)
                      </span>
                    ) : (
                      <span className="text-blue-600">Stable ➡️</span>
                    )}
                  </p>
                </div>
                <div
                  className="rounded-xl p-3 sm:p-4 transition-all duration-200 hover:-translate-y-1"
                  style={{
                    background:
                      theme === "dark"
                        ? "linear-gradient(135deg, #252937 0%, #2d3748 100%)"
                        : "linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)",
                    border:
                      theme === "dark"
                        ? "3px solid #2d3748"
                        : "3px solid #242622",
                    boxShadow:
                      theme === "dark" ? "0 4px 0 #2d3748" : "0 4px 0 #242622",
                  }}
                >
                  <p
                    className="text-xs sm:text-sm font-black uppercase tracking-widest mb-1 transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                    }}
                  >
                    Active vs Resolved
                  </p>
                  <p
                    className="text-sm sm:text-base md:text-lg font-black transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                    }}
                  >
                    {analytics.activeSymptoms} Active /{" "}
                    {analytics.resolvedSymptoms} Resolved
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
