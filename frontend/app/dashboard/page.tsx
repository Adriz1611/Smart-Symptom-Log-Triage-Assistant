"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { symptomApi } from "@/lib/api/symptoms";
import { Symptom } from "@/lib/types";
import {
  formatDateTime,
  getSeverityColor,
  getUrgencyColor,
  getUrgencyLabel,
} from "@/lib/utils";

export default function DashboardPage() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"date" | "severity">("date");

  useEffect(() => {
    loadSymptoms();
  }, []);

  const loadSymptoms = async () => {
    try {
      const response = await symptomApi.getAll({ limit: 50 });
      if (response.success && response.data) {
        setSymptoms(response.data.symptoms);
      }
    } catch (err: any) {
      setError("Failed to load symptoms");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search symptoms
  const filteredSymptoms = useMemo(() => {
    let filtered = symptoms;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.symptomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.bodyLocation?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    // Severity filter
    if (severityFilter !== "ALL") {
      const severityRanges: Record<string, [number, number]> = {
        LOW: [1, 3],
        MEDIUM: [4, 6],
        HIGH: [7, 10],
      };
      const [min, max] = severityRanges[severityFilter];
      filtered = filtered.filter((s) => s.severity >= min && s.severity <= max);
    }

    // Sort
    if (sortBy === "date") {
      filtered.sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      );
    } else {
      filtered.sort((a, b) => b.severity - a.severity);
    }

    return filtered;
  }, [symptoms, searchQuery, statusFilter, severityFilter, sortBy]);

  const stats = useMemo(() => {
    const all = symptoms;
    const active = all.filter((s) => s.status === "ACTIVE");
    const avgSeverity =
      active.length > 0
        ? (
            active.reduce((sum, s) => sum + s.severity, 0) / active.length
          ).toFixed(1)
        : "0";

    return {
      total: all.length,
      active: active.length,
      resolved: all.filter((s) => s.status === "RESOLVED").length,
      improving: all.filter((s) => s.status === "IMPROVING").length,
      worsening: all.filter((s) => s.status === "WORSENING").length,
      avgSeverity,
    };
  }, [symptoms]);

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Symptom",
      "Location",
      "Severity",
      "Status",
      "Urgency",
    ];
    const rows = filteredSymptoms.map((s) => [
      new Date(s.startedAt).toLocaleDateString(),
      s.symptomName,
      s.bodyLocation || "N/A",
      s.severity,
      s.status,
      s.triageAssessments?.[0]?.urgencyLevel || "N/A",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `symptoms-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Health Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Track and manage your health journey
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Total
                </div>
                <div className="text-4xl font-bold text-gray-900 mt-2">
                  {stats.total}
                </div>
              </div>
              <div className="w-14 h-14 bg-linear-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                  Active
                </div>
                <div className="text-4xl font-bold text-blue-600 mt-2">
                  {stats.active}
                </div>
              </div>
              <div className="w-14 h-14 bg-linear-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-amber-600 uppercase tracking-wide">
                  Improving
                </div>
                <div className="text-4xl font-bold text-amber-600 mt-2">
                  {stats.improving}
                </div>
              </div>
              <div className="w-14 h-14 bg-linear-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">📈</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-green-600 uppercase tracking-wide">
                  Resolved
                </div>
                <div className="text-4xl font-bold text-green-600 mt-2">
                  {stats.resolved}
                </div>
              </div>
              <div className="w-14 h-14 bg-linear-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Link
            href="/dashboard/symptoms/new"
            className="group relative inline-flex items-center px-8 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span className="text-2xl mr-3 group-hover:rotate-90 transition-transform duration-300">
              +
            </span>
            <span>Log New Symptom</span>
          </Link>
          <Link
            href="/dashboard/insights"
            className="group relative inline-flex items-center px-8 py-4 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span className="text-2xl mr-3 group-hover:scale-110 transition-transform duration-300">
              🤖
            </span>
            <span>AI Health Insights</span>
          </Link>
          <Link
            href="/dashboard/analytics"
            className="group relative inline-flex items-center px-8 py-4 bg-linear-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span className="text-2xl mr-3 group-hover:scale-110 transition-transform duration-300">
              📊
            </span>
            <span>Analytics</span>
          </Link>
          <Link
            href="/dashboard/medications"
            className="group relative inline-flex items-center px-8 py-4 bg-linear-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-2xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span className="text-2xl mr-3 group-hover:scale-110 transition-transform duration-300">
              💊
            </span>
            <span>Medications</span>
          </Link>
          <button
            onClick={exportToCSV}
            className="group relative inline-flex items-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:border-gray-300 hover:shadow-lg transition-all duration-300"
          >
            <span className="text-2xl mr-3">📥</span>
            <span>Export Data</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search symptoms or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <span className="absolute left-4 top-3.5 text-xl">🔍</span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="IMPROVING">Improving</option>
              <option value="WORSENING">Worsening</option>
              <option value="RESOLVED">Resolved</option>
              <option value="MONITORING">Monitoring</option>
            </select>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
            >
              <option value="ALL">All Severity</option>
              <option value="LOW">Low (1-3)</option>
              <option value="MEDIUM">Medium (4-6)</option>
              <option value="HIGH">High (7-10)</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "severity")}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
            >
              <option value="date">Sort by Date</option>
              <option value="severity">Sort by Severity</option>
            </select>
          </div>

          {/* Active Filters Display */}
          {(searchQuery ||
            statusFilter !== "ALL" ||
            severityFilter !== "ALL") && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-600">
                Active filters:
              </span>
              {searchQuery && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Search: "{searchQuery}"
                </span>
              )}
              {statusFilter !== "ALL" && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Status: {statusFilter}
                </span>
              )}
              {severityFilter !== "ALL" && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  Severity: {severityFilter}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                  setSeverityFilter("ALL");
                }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Clear all ✕
              </button>
            </div>
          )}

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing{" "}
            <span className="font-bold text-gray-900">
              {filteredSymptoms.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-900">{symptoms.length}</span>{" "}
            symptoms
          </div>
        </div>

        {/* Recent Symptoms */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Symptoms</h2>
            {filteredSymptoms.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Avg Severity:</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold">
                  {stats.avgSeverity}/10
                </span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">
                Loading symptoms...
              </p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : filteredSymptoms.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📋</span>
              </div>
              <p className="text-gray-600 mb-4 text-lg">
                {symptoms.length === 0
                  ? "No symptoms logged yet."
                  : "No symptoms match your filters."}
              </p>
              {symptoms.length === 0 ? (
                <Link
                  href="/dashboard/symptoms/new"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-lg group"
                >
                  Log your first symptom
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("ALL");
                    setSeverityFilter("ALL");
                  }}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-lg group"
                >
                  Clear all filters
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredSymptoms.map((symptom) => (
                <div
                  key={symptom.id}
                  className="p-6 hover:bg-blue-50/50 transition-all duration-200 group"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h3 className="text-xl font-bold text-gray-900 capitalize">
                          {symptom.symptomName}
                        </h3>
                        <span
                          className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getSeverityColor(
                            symptom.severity
                          )} shadow-sm`}
                        >
                          Severity {symptom.severity}/10
                        </span>
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
                            symptom.status === "ACTIVE"
                              ? "bg-blue-100 text-blue-700"
                              : symptom.status === "IMPROVING"
                              ? "bg-amber-100 text-amber-700"
                              : symptom.status === "WORSENING"
                              ? "bg-red-100 text-red-700"
                              : symptom.status === "RESOLVED"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {symptom.status}
                        </span>
                      </div>
                      {symptom.bodyLocation && (
                        <p className="text-gray-600 text-sm mb-2 flex items-center gap-2">
                          <span className="text-lg">📍</span>
                          <span className="font-medium">Location:</span>{" "}
                          {symptom.bodyLocation}
                        </p>
                      )}
                      <p className="text-gray-500 text-sm flex items-center gap-2">
                        <span className="text-lg">🕒</span>
                        <span className="font-medium">Logged:</span>{" "}
                        {formatDateTime(symptom.startedAt)}
                      </p>
                      {symptom.triageAssessments &&
                        symptom.triageAssessments[0] && (
                          <div className="mt-4">
                            <span
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 ${getUrgencyColor(
                                symptom.triageAssessments[0].urgencyLevel
                              )} shadow-sm`}
                            >
                              {getUrgencyLabel(
                                symptom.triageAssessments[0].urgencyLevel
                              )}
                            </span>
                          </div>
                        )}
                    </div>
                    <Link
                      href={`/dashboard/symptoms/${symptom.id}`}
                      className="shrink-0 px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg group-hover:scale-105"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
