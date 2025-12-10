"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import apiClient from "@/lib/api/client";

interface Symptom {
  id: number;
  symptomName: string;
  bodyLocation: string;
  severity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface AnalyticsData {
  totalSymptoms: number;
  activeSymptoms: number;
  resolvedSymptoms: number;
  avgSeverity: number;
  severityTrend: { date: string; severity: number }[];
  bodyLocationStats: { location: string; count: number }[];
  statusDistribution: { status: string; count: number }[];
  monthlyTrend: { month: string; count: number }[];
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState("30"); // days

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/symptoms?limit=1000");
      const allSymptoms = response.data;

      // Filter by time range
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange));
      const filteredSymptoms = allSymptoms.filter(
        (s: Symptom) => new Date(s.createdAt) >= cutoffDate
      );

      setSymptoms(filteredSymptoms);
      calculateAnalytics(filteredSymptoms);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (data: Symptom[]) => {
    if (data.length === 0) {
      setAnalytics(null);
      return;
    }

    // Total and status counts
    const totalSymptoms = data.length;
    const activeSymptoms = data.filter((s) => s.status === "ACTIVE").length;
    const resolvedSymptoms = data.filter((s) => s.status === "RESOLVED").length;

    // Average severity
    const avgSeverity =
      data.reduce((sum, s) => sum + s.severity, 0) / totalSymptoms;

    // Severity trend (last 30 days)
    const severityTrend = generateSeverityTrend(data);

    // Body location stats
    const locationMap = new Map<string, number>();
    data.forEach((s) => {
      locationMap.set(
        s.bodyLocation,
        (locationMap.get(s.bodyLocation) || 0) + 1
      );
    });
    const bodyLocationStats = Array.from(locationMap.entries())
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Status distribution
    const statusMap = new Map<string, number>();
    data.forEach((s) => {
      statusMap.set(s.status, (statusMap.get(s.status) || 0) + 1);
    });
    const statusDistribution = Array.from(statusMap.entries()).map(
      ([status, count]) => ({ status, count })
    );

    // Monthly trend
    const monthlyTrend = generateMonthlyTrend(data);

    setAnalytics({
      totalSymptoms,
      activeSymptoms,
      resolvedSymptoms,
      avgSeverity: Math.round(avgSeverity * 10) / 10,
      severityTrend,
      bodyLocationStats,
      statusDistribution,
      monthlyTrend,
    });
  };

  const generateSeverityTrend = (data: Symptom[]) => {
    const trend: { date: string; severity: number }[] = [];
    const days = 30;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const daySymptoms = data.filter((s) => {
        const symptomDate = new Date(s.createdAt).toISOString().split("T")[0];
        return symptomDate === dateStr;
      });

      const avgSeverity =
        daySymptoms.length > 0
          ? daySymptoms.reduce((sum, s) => sum + s.severity, 0) /
            daySymptoms.length
          : 0;

      trend.push({
        date: dateStr,
        severity: Math.round(avgSeverity * 10) / 10,
      });
    }

    return trend;
  };

  const generateMonthlyTrend = (data: Symptom[]) => {
    const monthMap = new Map<string, number>();

    data.forEach((s) => {
      const date = new Date(s.createdAt);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
    });

    return Array.from(monthMap.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      ACTIVE: "bg-blue-100 text-blue-700 border-blue-300",
      IMPROVING: "bg-green-100 text-green-700 border-green-300",
      WORSENING: "bg-red-100 text-red-700 border-red-300",
      RESOLVED: "bg-gray-100 text-gray-700 border-gray-300",
      MONITORING: "bg-amber-100 text-amber-700 border-amber-300",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const maxLocationCount = analytics
    ? Math.max(...analytics.bodyLocationStats.map((l) => l.count))
    : 1;
  const maxMonthCount = analytics
    ? Math.max(...analytics.monthlyTrend.map((m) => m.count))
    : 1;
  const maxSeverity = 10;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-2 transition-colors"
            >
              <span className="mr-2">←</span>
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Health Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              Comprehensive insights into your symptom patterns
            </p>
          </div>

          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium shadow-sm"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
            <option value="9999">All Time</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
          </div>
        ) : !analytics ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📊</span>
            </div>
            <p className="text-gray-600 text-lg mb-4">
              No data available for the selected time range
            </p>
            <Link
              href="/dashboard/symptoms/new"
              className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold"
            >
              Log your first symptom
              <span className="ml-2">→</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📋</span>
                  </div>
                  <span className="text-3xl font-bold text-gray-900">
                    {analytics.totalSymptoms}
                  </span>
                </div>
                <p className="text-gray-600 font-medium">Total Symptoms</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-linear-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <span className="text-3xl font-bold text-orange-600">
                    {analytics.activeSymptoms}
                  </span>
                </div>
                <p className="text-gray-600 font-medium">Active Symptoms</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-linear-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                  <span className="text-3xl font-bold text-green-600">
                    {analytics.resolvedSymptoms}
                  </span>
                </div>
                <p className="text-gray-600 font-medium">Resolved Symptoms</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-linear-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <span className="text-3xl font-bold text-purple-600">
                    {analytics.avgSeverity}
                  </span>
                </div>
                <p className="text-gray-600 font-medium">Avg Severity</p>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Severity Trend Chart */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>📈</span>
                  Severity Trend (Last 30 Days)
                </h2>
                <div className="space-y-2">
                  {analytics.severityTrend
                    .filter((_, i) => i % 3 === 0)
                    .map((item) => (
                      <div key={item.date} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-20 shrink-0">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              item.severity >= 7
                                ? "bg-linear-to-r from-red-500 to-red-600"
                                : item.severity >= 4
                                ? "bg-linear-to-r from-amber-500 to-amber-600"
                                : "bg-linear-to-r from-green-500 to-green-600"
                            }`}
                            style={{
                              width: `${(item.severity / maxSeverity) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 w-8">
                          {item.severity > 0 ? item.severity : "-"}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Status Distribution */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>🎯</span>
                  Status Distribution
                </h2>
                <div className="space-y-4">
                  {analytics.statusDistribution.map((item) => (
                    <div key={item.status}>
                      <div className="flex justify-between items-center mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                        <span className="text-lg font-bold text-gray-700">
                          {item.count}
                        </span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-linear-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all"
                          style={{
                            width: `${
                              (item.count / analytics.totalSymptoms) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Body Location Heatmap */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>🗺️</span>
                  Body Location Heatmap
                </h2>
                <div className="space-y-3">
                  {analytics.bodyLocationStats.map((item) => (
                    <div key={item.location}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {item.location}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {item.count} symptoms
                        </span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            item.count / maxLocationCount >= 0.7
                              ? "bg-linear-to-r from-red-500 to-red-600"
                              : item.count / maxLocationCount >= 0.4
                              ? "bg-linear-to-r from-orange-500 to-orange-600"
                              : "bg-linear-to-r from-blue-500 to-blue-600"
                          }`}
                          style={{
                            width: `${(item.count / maxLocationCount) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Trend */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>📅</span>
                  Monthly Symptom Count
                </h2>
                <div className="space-y-3">
                  {analytics.monthlyTrend.map((item) => (
                    <div key={item.month}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {new Date(item.month + "-01").toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {item.count}
                        </span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-linear-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all"
                          style={{
                            width: `${(item.count / maxMonthCount) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Insights Section */}
            <div className="bg-linear-to-br from-purple-100 to-pink-100 rounded-2xl shadow-lg border border-purple-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>💡</span>
                Key Insights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-gray-700">
                    <span className="font-bold text-purple-600">
                      {analytics.activeSymptoms > 0
                        ? `${Math.round(
                            (analytics.activeSymptoms /
                              analytics.totalSymptoms) *
                              100
                          )}%`
                        : "0%"}
                    </span>{" "}
                    of your symptoms are currently active
                  </p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-gray-700">
                    <span className="font-bold text-green-600">
                      {analytics.resolvedSymptoms > 0
                        ? `${Math.round(
                            (analytics.resolvedSymptoms /
                              analytics.totalSymptoms) *
                              100
                          )}%`
                        : "0%"}
                    </span>{" "}
                    resolution rate across all symptoms
                  </p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-gray-700">
                    Most affected area:{" "}
                    <span className="font-bold text-orange-600 capitalize">
                      {analytics.bodyLocationStats[0]?.location || "N/A"}
                    </span>
                  </p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-gray-700">
                    Average severity is{" "}
                    <span
                      className={`font-bold ${
                        analytics.avgSeverity >= 7
                          ? "text-red-600"
                          : analytics.avgSeverity >= 4
                          ? "text-amber-600"
                          : "text-green-600"
                      }`}
                    >
                      {analytics.avgSeverity >= 7
                        ? "High"
                        : analytics.avgSeverity >= 4
                        ? "Moderate"
                        : "Low"}
                    </span>
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
