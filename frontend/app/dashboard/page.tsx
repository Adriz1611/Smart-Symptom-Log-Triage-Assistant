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
import { useTheme } from "@/lib/theme/theme-context";
import Button3D from "@/components/ui/Button3D";
import Select3D from "@/components/ui/Select3D";
import { ShareModal } from "@/components/ui/ShareModal";
import {
  generateSymptomsPDF,
  downloadPDF,
  getPDFBlob,
} from "@/lib/utils/pdf-generator";

const ITEMS_PER_PAGE = 10;

export default function DashboardPage() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"date" | "severity">("date");
  const [seeding, setSeeding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    loadSymptoms();
  }, []);

  const loadSymptoms = async () => {
    try {
      const response = await symptomApi.getAll();
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

  const seedTestData = async () => {
    if (
      !confirm(
        "This will create 100 test symptoms for the year 2025. Continue?"
      )
    ) {
      return;
    }

    try {
      setSeeding(true);
      const response = await symptomApi.seedSymptoms();
      if (response.success) {
        alert(
          `✅ Successfully created ${
            response.data?.count || 100
          } test symptoms!`
        );
        loadSymptoms(); // Reload the symptoms
      }
    } catch (err: any) {
      alert("Failed to seed test data: " + (err.message || "Unknown error"));
      console.error(err);
    } finally {
      setSeeding(false);
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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, severityFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredSymptoms.length / ITEMS_PER_PAGE);
  const paginatedSymptoms = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredSymptoms.slice(start, end);
  }, [filteredSymptoms, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

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

  const handleShareReport = async (
    method: "email" | "whatsapp" | "download"
  ) => {
    try {
      // Prepare symptom data for PDF
      const symptomsData = filteredSymptoms.map((s) => ({
        id: s.id,
        symptomName: s.symptomName,
        bodyLocation: s.bodyLocation || "N/A",
        severity: s.severity,
        status: s.status,
        startedAt: s.startedAt,
        triageAssessment: s.triageAssessments?.[0]
          ? {
              urgencyLevel: s.triageAssessments[0].urgencyLevel,
              recommendation: s.triageAssessments[0].recommendation || "",
            }
          : undefined,
        details: s.details
          ? {
              notes: s.details.notes || "",
              characteristic: s.details.characteristic,
              frequency: s.details.frequency,
            }
          : undefined,
      }));

      // Generate PDF
      const userName = "Patient"; // You can get this from user context
      const pdf = generateSymptomsPDF(symptomsData, userName);
      const filename = `symptom-report-${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      if (method === "download") {
        downloadPDF(pdf, filename);
      } else if (method === "email") {
        const pdfBlob = getPDFBlob(pdf);
        const file = new File([pdfBlob], filename, { type: "application/pdf" });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "Symptom Report",
            text: "Here is my symptom report",
          });
        } else {
          // Fallback: create mailto link
          const mailtoLink = `mailto:?subject=Symptom Report&body=Please find my symptom report attached.`;
          window.location.href = mailtoLink;
          // Also download the PDF since we can't attach via mailto
          downloadPDF(pdf, filename);
          alert("PDF downloaded. Please attach it to your email manually.");
        }
      } else if (method === "whatsapp") {
        downloadPDF(pdf, filename);
        const message = encodeURIComponent(
          "Check out my health symptom report!"
        );
        window.open(`https://wa.me/?text=${message}`, "_blank");
        alert("PDF downloaded. Please share the file via WhatsApp manually.");
      }
    } catch (error) {
      console.error("Failed to generate/share report:", error);
      alert("Failed to generate report. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{ background: theme === "dark" ? "#0a0b0f" : "#fffef9" }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 transition-colors duration-200"
            style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
          >
            Health Dashboard
          </h1>
          <p
            className="text-sm sm:text-base md:text-lg font-bold transition-colors duration-200"
            style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}
          >
            Track and manage your health journey
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <div
            className="p-4 sm:p-5 md:p-6 rounded-xl transition-all duration-200 hover:-translate-y-1"
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
            <div className="flex items-center justify-between">
              <div>
                <div
                  className="text-xs sm:text-sm font-black uppercase tracking-widest transition-colors duration-200"
                  style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}
                >
                  Total
                </div>
                <div
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1 sm:mt-1.5 transition-colors duration-200"
                  style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
                >
                  {stats.total}
                </div>
              </div>
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg, #2d3748 0%, #374151 100%)"
                      : "linear-gradient(135deg, rgb(243, 244, 246) 0%, rgb(229, 231, 235) 100%)",
                  border: "3px solid #242622",
                  boxShadow: "0 3px 0 #242622",
                }}
              >
                <span className="text-lg sm:text-xl md:text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div
            className="p-4 sm:p-5 md:p-6 rounded-xl transition-all duration-200 hover:-translate-y-1"
            style={{
              background:
                theme === "dark"
                  ? "linear-gradient(135deg, #1a1d29 0%, #1e2a3f 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #dbeafe 100%)",
              border:
                theme === "dark" ? "3px solid #3b82f6" : "3px solid #242622",
              boxShadow:
                theme === "dark"
                  ? "0 0 24px rgba(59, 130, 246, 0.6), 0 6px 0 #3b82f6"
                  : "0 6px 0 rgb(59, 130, 246)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div
                  className="text-xs sm:text-sm font-black uppercase tracking-widest"
                  style={{
                    color: theme === "dark" ? "#93c5fd" : "rgb(30, 58, 138)",
                  }}
                >
                  Active
                </div>
                <div
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1 sm:mt-1.5"
                  style={{
                    color: theme === "dark" ? "#93c5fd" : "rgb(30, 58, 138)",
                  }}
                >
                  {stats.active}
                </div>
              </div>
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(219, 234, 254) 0%, rgb(191, 219, 254) 100%)",
                  border: "3px solid #242622",
                  boxShadow: "0 3px 0 #242622",
                }}
              >
                <span className="text-lg sm:text-xl md:text-2xl">⚡</span>
              </div>
            </div>
          </div>

          <div
            className="p-4 sm:p-5 md:p-6 rounded-xl transition-all duration-200 hover:-translate-y-1"
            style={{
              background:
                theme === "dark"
                  ? "linear-gradient(135deg, #1a1d29 0%, #2a2418 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)",
              border:
                theme === "dark" ? "3px solid #f59e0b" : "3px solid #242622",
              boxShadow:
                theme === "dark"
                  ? "0 0 24px rgba(245, 158, 11, 0.6), 0 6px 0 #f59e0b"
                  : "0 6px 0 rgb(245, 158, 11)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div
                  className="text-xs sm:text-sm font-black uppercase tracking-widest"
                  style={{
                    color: theme === "dark" ? "#fbbf24" : "rgb(146, 64, 14)",
                  }}
                >
                  Improving
                </div>
                <div
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1 sm:mt-1.5"
                  style={{
                    color: theme === "dark" ? "#fbbf24" : "rgb(146, 64, 14)",
                  }}
                >
                  {stats.improving}
                </div>
              </div>
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(254, 243, 199) 0%, rgb(253, 230, 138) 100%)",
                  border: "3px solid #242622",
                  boxShadow: "0 3px 0 #242622",
                }}
              >
                <span className="text-lg sm:text-xl md:text-2xl">📈</span>
              </div>
            </div>
          </div>

          <div
            className="p-4 sm:p-5 md:p-6 rounded-xl transition-all duration-200 hover:-translate-y-1"
            style={{
              background:
                theme === "dark"
                  ? "linear-gradient(135deg, #1a1d29 0%, #1a2e23 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #bbf7d0 100%)",
              border:
                theme === "dark" ? "3px solid #22c55e" : "3px solid #242622",
              boxShadow:
                theme === "dark"
                  ? "0 0 24px rgba(34, 197, 94, 0.6), 0 6px 0 #22c55e"
                  : "0 6px 0 rgb(34, 197, 94)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div
                  className="text-xs sm:text-sm font-black uppercase tracking-widest"
                  style={{
                    color: theme === "dark" ? "#6ee7b7" : "rgb(22, 101, 52)",
                  }}
                >
                  Resolved
                </div>
                <div
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1 sm:mt-1.5"
                  style={{
                    color: theme === "dark" ? "#6ee7b7" : "rgb(22, 101, 52)",
                  }}
                >
                  {stats.resolved}
                </div>
              </div>
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(187, 247, 208) 0%, rgb(134, 239, 172) 100%)",
                  border: "3px solid #242622",
                  boxShadow: "0 3px 0 #242622",
                }}
              >
                <span className="text-lg sm:text-xl md:text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-4 sm:mb-6 md:mb-8 grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4 md:gap-6">
          <Link
            href="/dashboard/symptoms/new"
            className="col-span-2 sm:col-span-1"
          >
            <Button3D variant="blue" size="sm" fullWidth>
              <span className="flex items-center justify-center">
                <span className="text-base sm:text-lg mr-1.5 sm:mr-2">+</span>
                <span className="text-xs sm:text-sm md:text-base">
                  Log New Symptom
                </span>
              </span>
            </Button3D>
          </Link>
          <Link href="/dashboard/insights">
            <Button3D variant="purple" size="sm" fullWidth>
              <span className="flex items-center justify-center">
                <span className="text-base sm:text-lg mr-1.5 sm:mr-2">🤖</span>
                <span className="text-xs sm:text-sm md:text-base hidden sm:inline">
                  AI Insights
                </span>
                <span className="sm:hidden text-xs">AI</span>
              </span>
            </Button3D>
          </Link>
          <Link href="/dashboard/analytics">
            <Button3D variant="emerald" size="sm" fullWidth>
              <span className="flex items-center justify-center">
                <span className="text-base sm:text-lg mr-1.5 sm:mr-2">📊</span>
                <span className="text-xs sm:text-sm md:text-base hidden sm:inline">
                  Analytics
                </span>
                <span className="sm:hidden text-xs">Stats</span>
              </span>
            </Button3D>
          </Link>
          <Link href="/dashboard/medications">
            <Button3D variant="teal" size="sm" fullWidth>
              <span className="flex items-center justify-center">
                <span className="text-base sm:text-lg mr-1.5 sm:mr-2">💊</span>
                <span className="text-xs sm:text-sm md:text-base hidden sm:inline">
                  Medications
                </span>
                <span className="sm:hidden text-xs">Meds</span>
              </span>
            </Button3D>
          </Link>
          <div className="hidden sm:block">
            <Button3D variant="white" size="sm" onClick={exportToCSV}>
              <span className="flex items-center">
                <span className="text-lg sm:text-2xl mr-2 sm:mr-3">📥</span>
                <span className="text-xs sm:text-sm md:text-base">Export</span>
              </span>
            </Button3D>
          </div>
          <div className="hidden sm:block">
            <Button3D
              variant="indigo"
              size="sm"
              onClick={() => setShowShareModal(true)}
            >
              <span className="flex items-center">
                <span className="text-lg sm:text-2xl mr-2 sm:mr-3">📤</span>
                <span className="text-xs sm:text-sm md:text-base">
                  Share PDF
                </span>
              </span>
            </Button3D>
          </div>
          <div className="hidden md:block">
            <Button3D
              variant="orange"
              size="sm"
              onClick={seedTestData}
              disabled={seeding}
            >
              <span className="flex items-center">
                <span className="text-lg mr-2">🌱</span>
                <span>{seeding ? "Seeding..." : "Seed Test Data"}</span>
              </span>
            </Button3D>
          </div>
        </div>

        {/* Search and Filters */}
        <div
          className="mb-4 sm:mb-6 rounded-xl p-4 sm:p-5 md:p-6 transition-all duration-200"
          style={{
            background:
              theme === "dark"
                ? "linear-gradient(135deg, #1a1d29 0%, #252937 100%)"
                : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
            border:
              theme === "dark" ? "3px solid #2d3748" : "3px solid #242622",
            boxShadow: theme === "dark" ? "0 6px 0 #2d3748" : "0 6px 0 #242622",
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {/* Search */}
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search symptoms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-11 pr-10 sm:pr-11 py-3 sm:py-3.5 rounded-xl outline-none font-bold text-sm sm:text-base transition-all duration-200 hover:-translate-y-0.5 focus:-translate-y-1"
                  style={{
                    border:
                      theme === "dark"
                        ? "3px solid #4a5568"
                        : "3px solid #242622",
                    background: theme === "dark" ? "#2d3748" : "white",
                    color: theme === "dark" ? "#e5e7eb" : "#242622",
                    boxShadow:
                      theme === "dark" ? "0 4px 0 #4a5568" : "0 4px 0 #242622",
                  }}
                />
                <span className="absolute left-3 sm:left-3.5 top-3 sm:top-3.5 text-lg sm:text-xl">
                  🔍
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 sm:right-3 top-2.5 sm:top-3 hover:opacity-70 font-bold text-sm sm:text-base transition-colors duration-200"
                    style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <Select3D
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "ALL", label: "All Status" },
                { value: "ACTIVE", label: "Active" },
                { value: "IMPROVING", label: "Improving" },
                { value: "WORSENING", label: "Worsening" },
                { value: "RESOLVED", label: "Resolved" },
                { value: "MONITORING", label: "Monitoring" },
              ]}
            />

            {/* Severity Filter */}
            <Select3D
              value={severityFilter}
              onChange={setSeverityFilter}
              options={[
                { value: "ALL", label: "All Severity" },
                { value: "LOW", label: "Low (1-3)" },
                { value: "MEDIUM", label: "Medium (4-6)" },
                { value: "HIGH", label: "High (7-10)" },
              ]}
            />

            {/* Sort */}
            <Select3D
              value={sortBy}
              onChange={(value) => setSortBy(value as "date" | "severity")}
              options={[
                { value: "date", label: "Sort by Date" },
                { value: "severity", label: "Sort by Severity" },
              ]}
            />
          </div>

          {/* Active Filters Display */}
          {(searchQuery ||
            statusFilter !== "ALL" ||
            severityFilter !== "ALL") && (
            <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
              <span
                className="text-sm sm:text-base font-bold transition-colors duration-200"
                style={{ color: theme === "dark" ? "#9ca3af" : "#6b7280" }}
              >
                Active filters:
              </span>
              {searchQuery && (
                <span
                  className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-sm sm:text-base font-bold"
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(59, 130, 246, 0.2)"
                        : "rgb(219, 234, 254)",
                    color: theme === "dark" ? "#93c5fd" : "rgb(30, 58, 138)",
                  }}
                >
                  Search: "{searchQuery}"
                </span>
              )}
              {statusFilter !== "ALL" && (
                <span
                  className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-sm sm:text-base font-bold"
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(168, 85, 247, 0.2)"
                        : "rgb(243, 232, 255)",
                    color: theme === "dark" ? "#c084fc" : "rgb(107, 33, 168)",
                  }}
                >
                  Status: {statusFilter}
                </span>
              )}
              {severityFilter !== "ALL" && (
                <span
                  className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-sm sm:text-base font-bold"
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(245, 158, 11, 0.2)"
                        : "rgb(254, 243, 199)",
                    color: theme === "dark" ? "#fbbf24" : "rgb(146, 64, 14)",
                  }}
                >
                  Severity: {severityFilter}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                  setSeverityFilter("ALL");
                }}
                className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm sm:text-base font-bold hover:bg-gray-200 transition-colors"
              >
                Clear all ✕
              </button>
            </div>
          )}

          {/* Results count */}
          <div
            className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg font-bold transition-colors duration-200"
            style={{ color: theme === "dark" ? "#9ca3af" : "#6b7280" }}
          >
            Showing{" "}
            <span
              className="font-black transition-colors duration-200"
              style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
            >
              {filteredSymptoms.length === 0
                ? 0
                : (currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>
            {" - "}
            <span
              className="font-black transition-colors duration-200"
              style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
            >
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredSymptoms.length)}
            </span>{" "}
            of{" "}
            <span
              className="font-black transition-colors duration-200"
              style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
            >
              {filteredSymptoms.length}
            </span>{" "}
            filtered ({symptoms.length} total)
          </div>
        </div>

        {/* Recent Symptoms */}
        <div
          className="rounded-xl transition-all duration-200"
          style={{
            background:
              theme === "dark"
                ? "linear-gradient(135deg, #1a1d29 0%, #252937 100%)"
                : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
            border:
              theme === "dark" ? "3px solid #2d3748" : "3px solid #242622",
            boxShadow: theme === "dark" ? "0 6px 0 #2d3748" : "0 6px 0 #242622",
          }}
        >
          <div
            className="px-4 sm:px-5 md:px-6 py-4 sm:py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 transition-colors duration-200"
            style={{
              borderBottom:
                theme === "dark" ? "3px solid #2d3748" : "3px solid #242622",
            }}
          >
            <h2
              className="text-xl sm:text-2xl md:text-3xl font-black transition-colors duration-200"
              style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
            >
              Symptoms
            </h2>
            {filteredSymptoms.length > 0 && (
              <div className="flex items-center gap-2 text-sm sm:text-base md:text-lg">
                <span
                  className="font-black transition-colors duration-200"
                  style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}
                >
                  Avg Severity:
                </span>
                <span
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-black text-sm sm:text-base"
                  style={{
                    background:
                      "linear-gradient(135deg, rgb(219, 234, 254) 0%, rgb(191, 219, 254) 100%)",
                    color: "rgb(30, 58, 138)",
                    border: "3px solid #242622",
                    boxShadow: "0 3px 0 #242622",
                  }}
                >
                  {stats.avgSeverity}/10
                </span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="p-6 sm:p-8 md:p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
              <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">
                Loading symptoms...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 sm:p-6 md:p-8 text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">⚠️</span>
              </div>
              <p className="text-red-600 text-sm sm:text-base">{error}</p>
            </div>
          ) : filteredSymptoms.length === 0 ? (
            <div className="p-6 sm:p-8 md:p-12 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl md:text-4xl">📋</span>
              </div>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                {symptoms.length === 0
                  ? "No symptoms logged yet."
                  : "No symptoms match your filters."}
              </p>
              {symptoms.length === 0 ? (
                <Link
                  href="/dashboard/symptoms/new"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group text-sm sm:text-base"
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
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group text-sm sm:text-base"
                >
                  Clear all filters
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>
              )}
            </div>
          ) : (
            <div>
              {paginatedSymptoms.map((symptom) => (
                <div
                  key={symptom.id}
                  className="p-3 sm:p-4 md:p-6 transition-colors"
                  style={{
                    borderBottom:
                      theme === "dark"
                        ? "2px solid #2d3748"
                        : "2px solid #e5e7eb",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      theme === "dark" ? "#252937" : "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                    <div className="flex-1 w-full sm:w-auto">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                        <h3
                          className="text-lg sm:text-xl md:text-2xl font-black capitalize transition-colors duration-200"
                          style={{
                            color: theme === "dark" ? "#e5e7eb" : "#242622",
                          }}
                        >
                          {symptom.symptomName}
                        </h3>
                        <span
                          className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-sm sm:text-base font-black"
                          style={{
                            background:
                              symptom.severity >= 7
                                ? "rgb(254, 226, 226)"
                                : symptom.severity >= 4
                                ? "rgb(254, 243, 199)"
                                : "rgb(187, 247, 208)",
                            color:
                              symptom.severity >= 7
                                ? "rgb(127, 29, 29)"
                                : symptom.severity >= 4
                                ? "rgb(146, 64, 14)"
                                : "rgb(22, 101, 52)",
                            border: "2px solid #242622",
                            boxShadow: "0 2px 0 #242622",
                          }}
                        >
                          <span className="hidden xs:inline">Severity </span>
                          {symptom.severity}/10
                        </span>
                        <span
                          className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-black uppercase"
                          style={{
                            background:
                              symptom.status === "ACTIVE"
                                ? "rgb(219, 234, 254)"
                                : symptom.status === "IMPROVING"
                                ? "rgb(254, 243, 199)"
                                : symptom.status === "WORSENING"
                                ? "rgb(254, 226, 226)"
                                : symptom.status === "RESOLVED"
                                ? "rgb(187, 247, 208)"
                                : "rgb(243, 244, 246)",
                            color:
                              symptom.status === "ACTIVE"
                                ? "rgb(30, 58, 138)"
                                : symptom.status === "IMPROVING"
                                ? "rgb(146, 64, 14)"
                                : symptom.status === "WORSENING"
                                ? "rgb(127, 29, 29)"
                                : symptom.status === "RESOLVED"
                                ? "rgb(22, 101, 52)"
                                : "#525252",
                            border: "2px solid #242622",
                            boxShadow: "0 2px 0 #242622",
                          }}
                        >
                          {symptom.status}
                        </span>
                      </div>
                      {symptom.bodyLocation && (
                        <p
                          className="text-sm sm:text-base font-bold mb-2 flex items-center gap-1.5 sm:gap-2"
                          style={{
                            color: theme === "dark" ? "#9ca3af" : "#525252",
                          }}
                        >
                          <span>📍</span>
                          <span className="hidden xs:inline">
                            Location:
                          </span>{" "}
                          {symptom.bodyLocation}
                        </p>
                      )}
                      <p
                        className="text-sm sm:text-base font-bold flex items-center gap-1.5 sm:gap-2"
                        style={{
                          color: theme === "dark" ? "#9ca3af" : "#525252",
                        }}
                      >
                        <span>🕒</span>
                        <span className="hidden xs:inline">Logged:</span>{" "}
                        {formatDateTime(symptom.startedAt)}
                      </p>
                      {symptom.triageAssessments &&
                        symptom.triageAssessments[0] && (
                          <div className="mt-2 sm:mt-3">
                            <span
                              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-black"
                              style={{
                                background:
                                  symptom.triageAssessments[0].urgencyLevel ===
                                  "EMERGENCY"
                                    ? "rgb(254, 226, 226)"
                                    : symptom.triageAssessments[0]
                                        .urgencyLevel === "URGENT"
                                    ? "rgb(254, 243, 199)"
                                    : symptom.triageAssessments[0]
                                        .urgencyLevel === "SEMI_URGENT"
                                    ? "rgb(219, 234, 254)"
                                    : "rgb(187, 247, 208)",
                                color:
                                  symptom.triageAssessments[0].urgencyLevel ===
                                  "EMERGENCY"
                                    ? "rgb(127, 29, 29)"
                                    : symptom.triageAssessments[0]
                                        .urgencyLevel === "URGENT"
                                    ? "rgb(146, 64, 14)"
                                    : symptom.triageAssessments[0]
                                        .urgencyLevel === "SEMI_URGENT"
                                    ? "rgb(30, 58, 138)"
                                    : "rgb(22, 101, 52)",
                                border: "3px solid #242622",
                                boxShadow: "0 3px 0 #242622",
                              }}
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
                      className="w-full sm:w-auto"
                    >
                      <Button3D
                        variant="blue"
                        size="sm"
                        fullWidth
                        className="sm:w-auto"
                      >
                        <span className="sm:hidden">View →</span>
                        <span className="hidden sm:inline">View Details →</span>
                      </Button3D>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredSymptoms.length > ITEMS_PER_PAGE && (
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
              <div className="text-sm sm:text-base font-bold text-gray-600 order-2 sm:order-1">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center order-1 sm:order-2">
                <Button3D
                  variant="white"
                  size="sm"
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="hidden sm:inline-flex"
                >
                  First
                </Button3D>
                <Button3D
                  variant="white"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <span className="sm:hidden">←</span>
                  <span className="hidden sm:inline">← Prev</span>
                </Button3D>

                {/* Page numbers - show fewer on mobile */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage <= 2) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 1) {
                      pageNum = totalPages - 2 + i;
                    } else {
                      pageNum = currentPage - 1 + i;
                    }

                    return (
                      <Button3D
                        key={pageNum}
                        variant={currentPage === pageNum ? "blue" : "white"}
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                      >
                        {pageNum}
                      </Button3D>
                    );
                  })}
                </div>

                <Button3D
                  variant="white"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <span className="sm:hidden">→</span>
                  <span className="hidden sm:inline">Next →</span>
                </Button3D>
                <Button3D
                  variant="white"
                  size="sm"
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="hidden sm:inline-flex"
                >
                  Last
                </Button3D>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShare={handleShareReport}
        title="Share Symptom Report"
        description="Generate and share a beautiful PDF report of your symptoms"
      />
    </div>
  );
}
