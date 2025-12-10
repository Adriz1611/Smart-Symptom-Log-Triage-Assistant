"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { insightsApi, HealthInsight } from "@/lib/api/insights";
import { useTheme } from "@/lib/theme/theme-context";
import Button3D from "@/components/ui/Button3D";
import { ShareModal } from "@/components/ui/ShareModal";
import {
  generateAIInsightsPDF,
  downloadPDF,
  getPDFBlob,
} from "@/lib/utils/pdf-generator";

export default function InsightsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<HealthInsight | null>(
    null
  );

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await insightsApi.getAll();

      if (response.success && response.data) {
        setInsights(response.data.insights);
      }
    } catch (err: any) {
      console.error("Fetch insights error:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async () => {
    try {
      setGenerating(true);
      setError("");
      setMessage("");

      const response = await insightsApi.generate();

      if (response.success && response.data) {
        setInsights(response.data.insights);
        setMessage(response.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to generate insights");
    } finally {
      setGenerating(false);
    }
  };

  const deleteInsight = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this insight?"))
      return;

    try {
      await insightsApi.delete(id);
      setInsights(insights.filter((i) => i.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete insight");
    }
  };

  const handleShareInsight = async (
    method: "email" | "whatsapp" | "download"
  ) => {
    if (!selectedInsight) return;

    try {
      // Prepare data for PDF using correct HealthInsight properties
      const insightData = {
        symptomName: selectedInsight.title || "Health Insight",
        severity:
          selectedInsight.severity === "critical"
            ? 10
            : selectedInsight.severity === "high"
            ? 7
            : selectedInsight.severity === "medium"
            ? 5
            : 3,
        insights: {
          possibleCauses: [selectedInsight.description],
          riskAssessment: `${selectedInsight.insightType.toUpperCase()} - ${selectedInsight.severity.toUpperCase()} severity (${Math.round(
            selectedInsight.confidence * 100
          )}% confidence)`,
          recommendations: selectedInsight.recommendations,
          urgencyLevel:
            selectedInsight.severity === "critical"
              ? "EMERGENCY"
              : selectedInsight.severity === "high"
              ? "URGENT"
              : "NON_URGENT",
          disclaimer:
            "This is AI-generated information and should not replace professional medical advice.",
        },
      };

      // Generate PDF
      const userName = "Patient"; // You can get this from user context
      const pdf = generateAIInsightsPDF(insightData, userName);
      const filename = `ai-insights-${
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
            title: "AI Health Insights Report",
            text: "Here is my AI-generated health insights report",
          });
        } else {
          // Fallback: create mailto link
          const mailtoLink = `mailto:?subject=AI Health Insights Report&body=Please find my AI health insights attached.`;
          window.location.href = mailtoLink;
          downloadPDF(pdf, filename);
          alert("PDF downloaded. Please attach it to your email manually.");
        }
      } else if (method === "whatsapp") {
        downloadPDF(pdf, filename);
        const message = encodeURIComponent(
          "Check out my AI health insights report!"
        );
        window.open(`https://wa.me/?text=${message}`, "_blank");
        alert("PDF downloaded. Please share the file via WhatsApp manually.");
      }
    } catch (error) {
      console.error("Failed to generate/share report:", error);
      alert("Failed to generate report. Please try again.");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pattern":
        return "🔄";
      case "trend":
        return "📈";
      case "risk_factor":
        return "⚠️";
      case "recommendation":
        return "💡";
      default:
        return "📊";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "pattern":
        return "bg-blue-100 text-blue-800";
      case "trend":
        return "bg-green-100 text-green-800";
      case "risk_factor":
        return "bg-orange-100 text-orange-800";
      case "recommendation":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">
            Loading insights...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-200 py-4 sm:py-6 md:py-8"
      style={{ background: theme === "dark" ? "#0a0b0f" : "#f9fafb" }}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-7 md:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
            <div>
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold transition-colors duration-200"
                style={{
                  color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                }}
              >
                🤖 AI Health Insights
              </h1>
              <p
                className="mt-1 sm:mt-2 text-sm sm:text-base md:text-lg transition-colors duration-200"
                style={{
                  color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                }}
              >
                Discover patterns, trends, and personalized health
                recommendations
              </p>
            </div>
            <Button3D
              variant="white"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="self-start"
            >
              ← Back
            </Button3D>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Button3D
              variant="purple"
              size="md"
              onClick={generateInsights}
              disabled={generating}
            >
              {generating ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Generating Insights...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="text-xl">🤖</span>
                  Generate AI Insights
                </span>
              )}
            </Button3D>

            <Button3D variant="white" size="md" onClick={fetchInsights}>
              🔄 Refresh
            </Button3D>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 sm:mb-5 md:mb-6 p-3 sm:p-4 md:p-5 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl flex items-start gap-2 sm:gap-3 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="font-bold text-sm sm:text-base">Error</p>
              <p className="text-sm sm:text-base">{error}</p>
            </div>
          </div>
        )}

        {message && (
          <div className="mb-4 sm:mb-5 md:mb-6 p-3 sm:p-4 md:p-5 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-xl flex items-start gap-2 sm:gap-3 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">✅</span>
            <div className="flex-1">
              <p className="font-bold text-sm sm:text-base">Success</p>
              <p className="text-sm sm:text-base">{message}</p>
            </div>
          </div>
        )}

        {/* Insights List */}
        {insights.length === 0 ? (
          <div
            className="rounded-lg p-8 sm:p-12 md:p-16 text-center transition-colors duration-200"
            style={{
              background: theme === "dark" ? "#1a1d29" : "white",
              border:
                theme === "dark"
                  ? "1px solid #2d3748"
                  : "1px solid rgb(229, 231, 235)",
            }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
              <span className="text-3xl sm:text-4xl md:text-5xl">🤖</span>
            </div>
            <h2
              className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 transition-colors duration-200"
              style={{
                color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
              }}
            >
              No Insights Yet
            </h2>
            <p
              className="mb-6 sm:mb-7 md:mb-8 text-sm sm:text-base md:text-lg max-w-md mx-auto transition-colors duration-200"
              style={{
                color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
              }}
            >
              Generate AI-powered insights from your symptom history to discover
              patterns and get personalized recommendations
            </p>
            <Button3D
              variant="purple"
              size="md"
              onClick={generateInsights}
              disabled={generating}
            >
              Generate Your First Insights
            </Button3D>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="rounded-lg hover:shadow-md transition-all duration-300 p-4 sm:p-5 md:p-6 border-l-4"
                style={{
                  background: theme === "dark" ? "#1a1d29" : "white",
                  borderLeftColor:
                    insight.severity === "critical"
                      ? "rgb(239, 68, 68)"
                      : insight.severity === "high"
                      ? "rgb(249, 115, 22)"
                      : insight.severity === "medium"
                      ? "rgb(234, 179, 8)"
                      : "rgb(59, 130, 246)",
                }}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full">
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        insight.insightType === "pattern"
                          ? "bg-blue-100"
                          : insight.insightType === "trend"
                          ? "bg-green-100"
                          : insight.insightType === "risk_factor"
                          ? "bg-orange-100"
                          : "bg-purple-100"
                      }`}
                    >
                      <span className="text-lg sm:text-xl md:text-2xl">
                        {getTypeIcon(insight.insightType)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                        <h3
                          className="text-lg sm:text-xl md:text-2xl font-bold transition-colors duration-200"
                          style={{
                            color:
                              theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                          }}
                        >
                          {insight.title}
                        </h3>
                        <span
                          className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${getTypeColor(
                            insight.insightType
                          )}`}
                        >
                          {insight.insightType.replace("_", " ")}
                        </span>
                        <span
                          className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                            insight.severity === "critical"
                              ? "bg-red-100 text-red-700"
                              : insight.severity === "high"
                              ? "bg-orange-100 text-orange-700"
                              : insight.severity === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {insight.severity}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                  <Button3D
                    variant="red"
                    size="sm"
                    onClick={() => deleteInsight(insight.id)}
                    className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center self-start sm:ml-2"
                  >
                    <span className="text-lg sm:text-xl">×</span>
                  </Button3D>
                </div>

                {/* Related Symptoms */}
                {insight.relatedSymptoms.length > 0 && (
                  <div className="mb-4 sm:mb-5 bg-gray-50 rounded-xl p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                      <span className="text-base sm:text-lg">🔗</span>
                      Related Symptoms:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {insight.relatedSymptoms.map((symptom, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-medium shadow-sm border border-gray-200"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {insight.recommendations.length > 0 && (
                  <div className="mb-4 sm:mb-5 bg-blue-50 rounded-xl p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                      <span className="text-base sm:text-lg">💡</span>
                      Recommendations:
                    </p>
                    <ul className="space-y-2">
                      {insight.recommendations.map((rec, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm sm:text-base text-gray-700"
                        >
                          <span className="text-blue-500 mt-1">✓</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          insight.severity === "critical"
                            ? "bg-red-500"
                            : insight.severity === "high"
                            ? "bg-orange-500"
                            : insight.severity === "medium"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                      ></span>
                      <span className="font-semibold text-gray-700">
                        {insight.severity}
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-lg">🎯</span>
                      <span className="font-semibold text-gray-700">
                        {Math.round(insight.confidence * 100)}% confidence
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-lg">📅</span>
                      {new Date(insight.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <Button3D
                    variant="indigo"
                    size="sm"
                    onClick={() => {
                      setSelectedInsight(insight);
                      setShowShareModal(true);
                    }}
                  >
                    <span className="flex items-center gap-1">
                      <span className="text-base">📤</span>
                      <span className="hidden sm:inline">Share PDF</span>
                    </span>
                  </Button3D>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        {insights.length > 0 && (
          <div className="mt-6 sm:mt-7 md:mt-8 bg-indigo-50 rounded-lg p-4 sm:p-5 md:p-6 border border-indigo-200">
            <div className="flex gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-lg sm:text-xl md:text-2xl">ℹ️</span>
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2">
                  About AI Insights
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  These insights are generated by analyzing your symptom history
                  using advanced AI algorithms. They help identify patterns,
                  trends, and potential risk factors. Always consult with
                  healthcare professionals for medical advice.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => {
          setShowShareModal(false);
          setSelectedInsight(null);
        }}
        onShare={handleShareInsight}
        title="Share AI Insights Report"
        description="Generate and share a beautiful PDF of this AI insight"
      />
    </div>
  );
}
