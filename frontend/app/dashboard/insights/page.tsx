"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { insightsApi, HealthInsight } from "@/lib/api/insights";

export default function InsightsPage() {
  const router = useRouter();
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                🤖 AI Health Insights
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Discover patterns, trends, and personalized health
                recommendations
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 hover:bg-white rounded-xl transition-all"
            >
              ← Back
            </button>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={generateInsights}
              disabled={generating}
              className="group px-8 py-4 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100"
            >
              {generating ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Insights...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    🤖
                  </span>
                  Generate AI Insights
                </span>
              )}
            </button>

            <button
              onClick={fetchInsights}
              className="px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-5 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl flex items-start gap-3 shadow-md">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {message && (
          <div className="mb-6 p-5 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-xl flex items-start gap-3 shadow-md">
            <span className="text-2xl">✅</span>
            <div className="flex-1">
              <p className="font-bold">Success</p>
              <p>{message}</p>
            </div>
          </div>
        )}

        {/* Insights List */}
        {insights.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-16 text-center border border-gray-100">
            <div className="w-24 h-24 bg-linear-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🤖</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              No Insights Yet
            </h2>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              Generate AI-powered insights from your symptom history to discover
              patterns and get personalized recommendations
            </p>
            <button
              onClick={generateInsights}
              disabled={generating}
              className="px-8 py-4 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100"
            >
              Generate Your First Insights
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-l-4 ${
                  insight.severity === "critical"
                    ? "border-red-500"
                    : insight.severity === "high"
                    ? "border-orange-500"
                    : insight.severity === "medium"
                    ? "border-yellow-500"
                    : "border-blue-500"
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        insight.insightType === "pattern"
                          ? "bg-blue-100"
                          : insight.insightType === "trend"
                          ? "bg-green-100"
                          : insight.insightType === "risk_factor"
                          ? "bg-orange-100"
                          : "bg-purple-100"
                      }`}
                    >
                      <span className="text-2xl">
                        {getTypeIcon(insight.insightType)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {insight.title}
                        </h3>
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${getTypeColor(
                            insight.insightType
                          )}`}
                        >
                          {insight.insightType.replace("_", " ")}
                        </span>
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
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
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteInsight(insight.id)}
                    className="shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg ml-4 transition-all"
                    title="Delete insight"
                  >
                    <span className="text-xl">×</span>
                  </button>
                </div>

                {/* Related Symptoms */}
                {insight.relatedSymptoms.length > 0 && (
                  <div className="mb-5 bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="text-lg">🔗</span>
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
                  <div className="mb-5 bg-blue-50 rounded-xl p-4">
                    <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="text-lg">💡</span>
                      Recommendations:
                    </p>
                    <ul className="space-y-2">
                      {insight.recommendations.map((rec, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-gray-700"
                        >
                          <span className="text-blue-500 mt-1">✓</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-6">
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
                  </div>
                  <span className="flex items-center gap-2">
                    <span className="text-lg">📅</span>
                    {new Date(insight.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        {insights.length > 0 && (
          <div className="mt-8 bg-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 border border-indigo-100">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-2xl">ℹ️</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  About AI Insights
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
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
    </div>
  );
}
