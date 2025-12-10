"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { symptomApi } from "@/lib/api/symptoms";
import { Symptom } from "@/lib/types";
import { useTheme } from "@/lib/theme/theme-context";
import Button3D from "@/components/ui/Button3D";

export default function SymptomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const [symptom, setSymptom] = useState<Symptom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchSymptom = async () => {
      try {
        const response = await symptomApi.getById(params.id as string);
        if (response.success && response.data) {
          setSymptom(response.data);
        } else {
          setError("Failed to load symptom");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load symptom");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSymptom();
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this symptom?")) {
      return;
    }

    setDeleting(true);
    try {
      await symptomApi.delete(params.id as string);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete symptom");
      setDeleting(false);
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return "text-green-600";
    if (severity <= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "EMERGENCY":
        return "bg-red-600 text-white";
      case "URGENT":
        return "bg-orange-600 text-white";
      case "SEMI_URGENT":
        return "bg-yellow-600 text-white";
      case "NON_URGENT":
        return "bg-blue-600 text-white";
      case "SELF_CARE":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-red-100 text-red-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      case "IMPROVING":
        return "bg-blue-100 text-blue-800";
      case "WORSENING":
        return "bg-orange-100 text-orange-800";
      case "MONITORING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">
            Loading symptom details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !symptom) {
    return (
      <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
          <p className="text-red-800 text-sm sm:text-base">
            {error || "Symptom not found"}
          </p>
          <div className="mt-3 sm:mt-4">
            <Button3D
              variant="white"
              size="sm"
              onClick={() => router.push("/dashboard")}
            >
              ← Back to Dashboard
            </Button3D>
          </div>
        </div>
      </div>
    );
  }

  const latestTriage = symptom.triageAssessments?.[0];

  return (
    <div
      className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6 min-h-screen transition-colors duration-200"
      style={{ background: theme === "dark" ? "#0a0b0f" : "#fffef9" }}
    >
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="mb-3 sm:mb-4">
          <Button3D
            variant="white"
            size="sm"
            onClick={() => router.push("/dashboard")}
          >
            <span className="text-sm sm:text-base font-bold">← Back</span>
          </Button3D>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
          <div>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-black capitalize transition-colors duration-200"
              style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
            >
              {symptom.symptomName}
            </h1>
            {symptom.bodyLocation && (
              <p
                className="mt-2 font-bold text-base sm:text-lg transition-colors duration-200"
                style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}
              >
                📍 Location: {symptom.bodyLocation}
              </p>
            )}
          </div>
          <span
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-black uppercase mt-2 sm:mt-0"
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
              border: "3px solid #242622",
              boxShadow: "0 3px 0 #242622",
            }}
          >
            {symptom.status}
          </span>
        </div>
      </div>

      {/* Main Info Card */}
      <div
        className="rounded-xl p-5 sm:p-6 md:p-8 mb-4 sm:mb-6 transition-all duration-200"
        style={{
          background:
            theme === "dark"
              ? "linear-gradient(135deg, #1a1d29 0%, #252937 100%)"
              : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
          border: theme === "dark" ? "3px solid #2d3748" : "3px solid #242622",
          boxShadow: theme === "dark" ? "0 6px 0 #2d3748" : "0 6px 0 #242622",
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-5 sm:mb-6">
          <div>
            <p
              className="text-sm sm:text-base font-black uppercase tracking-wider mb-2 transition-colors duration-200"
              style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}
            >
              Severity
            </p>
            <p
              className="text-3xl sm:text-4xl font-black"
              style={{
                color:
                  symptom.severity >= 7
                    ? "rgb(127, 29, 29)"
                    : symptom.severity >= 4
                    ? "rgb(146, 64, 14)"
                    : "rgb(22, 101, 52)",
              }}
            >
              {symptom.severity}/10
            </p>
          </div>
          <div>
            <p
              className="text-sm sm:text-base font-black uppercase tracking-wider mb-2 transition-colors duration-200"
              style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}
            >
              Started
            </p>
            <p
              className="text-base sm:text-lg md:text-xl font-black transition-colors duration-200"
              style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
            >
              {new Date(symptom.startedAt).toLocaleDateString()}
            </p>
          </div>
          {symptom.endedAt && (
            <div>
              <p
                className="text-sm sm:text-base font-black uppercase tracking-wider mb-2 transition-colors duration-200"
                style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}
              >
                Ended
              </p>
              <p
                className="text-base sm:text-lg md:text-xl font-black transition-colors duration-200"
                style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
              >
                {new Date(symptom.endedAt).toLocaleDateString()}
              </p>
            </div>
          )}
          <div>
            <p
              className="text-sm sm:text-base font-black uppercase tracking-wider mb-2 transition-colors duration-200"
              style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}
            >
              Duration
            </p>
            <p
              className="text-base sm:text-lg md:text-xl font-black transition-colors duration-200"
              style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
            >
              {symptom.endedAt
                ? Math.ceil(
                    (new Date(symptom.endedAt).getTime() -
                      new Date(symptom.startedAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  ) + " days"
                : Math.ceil(
                    (Date.now() - new Date(symptom.startedAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  ) + " days"}
            </p>
          </div>
        </div>

        {/* Vital Signs */}
        {(symptom.details?.temperature ||
          symptom.details?.heartRate ||
          symptom.details?.bloodPressure) && (
          <div
            className="pt-4 sm:pt-5 mb-5 sm:mb-6"
            style={{
              borderTop:
                theme === "dark" ? "3px solid #2d3748" : "3px solid #242622",
            }}
          >
            <h3
              className="text-lg sm:text-xl md:text-2xl font-black mb-3 sm:mb-4 transition-colors duration-200"
              style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
            >
              Vital Signs
            </h3>
            <div className="grid grid-cols-3 gap-3 sm:gap-5">
              {symptom.details.temperature && (
                <div>
                  <p
                    className="text-sm sm:text-base font-bold mb-1 transition-colors duration-200"
                    style={{ color: theme === "dark" ? "#9ca3af" : "#6b7280" }}
                  >
                    Temp
                  </p>
                  <p
                    className="text-lg sm:text-xl md:text-2xl font-black transition-colors duration-200"
                    style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
                  >
                    {symptom.details.temperature}°F
                  </p>
                </div>
              )}
              {symptom.details.heartRate && (
                <div>
                  <p
                    className="text-sm sm:text-base font-bold mb-1 transition-colors duration-200"
                    style={{ color: theme === "dark" ? "#9ca3af" : "#6b7280" }}
                  >
                    HR
                  </p>
                  <p
                    className="text-lg sm:text-xl md:text-2xl font-black transition-colors duration-200"
                    style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
                  >
                    {symptom.details.heartRate} bpm
                  </p>
                </div>
              )}
              {symptom.details.bloodPressure && (
                <div>
                  <p
                    className="text-sm sm:text-base font-bold mb-1 transition-colors duration-200"
                    style={{ color: theme === "dark" ? "#9ca3af" : "#6b7280" }}
                  >
                    BP
                  </p>
                  <p
                    className="text-lg sm:text-xl md:text-2xl font-black transition-colors duration-200"
                    style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
                  >
                    {symptom.details.bloodPressure}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Symptom Details */}
        {symptom.details && (
          <div className="border-t pt-3 sm:pt-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
              Details
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {symptom.details.characteristic && (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700">
                    Characteristic
                  </p>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {symptom.details.characteristic}
                  </p>
                </div>
              )}
              {symptom.details.frequency && (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700">
                    Frequency
                  </p>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {symptom.details.frequency}
                  </p>
                </div>
              )}
              {symptom.details.triggers &&
                symptom.details.triggers.length > 0 && (
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700">
                      Triggers
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                      {symptom.details.triggers.map((trigger, index) => (
                        <span
                          key={index}
                          className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-100 text-red-800 rounded text-xs sm:text-sm"
                        >
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              {symptom.details.alleviatingFactors &&
                symptom.details.alleviatingFactors.length > 0 && (
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700">
                      Alleviating Factors
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                      {symptom.details.alleviatingFactors.map(
                        (factor, index) => (
                          <span
                            key={index}
                            className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-100 text-green-800 rounded text-xs sm:text-sm"
                          >
                            {factor}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              {symptom.details.aggravatingFactors &&
                symptom.details.aggravatingFactors.length > 0 && (
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700">
                      Aggravating Factors
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                      {symptom.details.aggravatingFactors.map(
                        (factor, index) => (
                          <span
                            key={index}
                            className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-orange-100 text-orange-800 rounded text-xs sm:text-sm"
                          >
                            {factor}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              {symptom.details.notes && (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700">
                    Notes
                  </p>
                  <p className="text-gray-900 whitespace-pre-wrap text-sm sm:text-base">
                    {symptom.details.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Triage Assessment */}
      {latestTriage && (
        <div
          className="rounded-xl p-5 sm:p-6 md:p-8 mb-4 sm:mb-6 transition-all duration-200"
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
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-black mb-4 sm:mb-5 transition-colors duration-200"
            style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
          >
            🏥 Triage Assessment
          </h2>
          <div className="space-y-4 sm:space-y-5">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-black text-base sm:text-lg"
                style={{
                  background:
                    latestTriage.urgencyLevel === "EMERGENCY"
                      ? "rgb(254, 226, 226)"
                      : latestTriage.urgencyLevel === "URGENT"
                      ? "rgb(254, 243, 199)"
                      : latestTriage.urgencyLevel === "SEMI_URGENT"
                      ? "rgb(219, 234, 254)"
                      : "rgb(187, 247, 208)",
                  color:
                    latestTriage.urgencyLevel === "EMERGENCY"
                      ? "rgb(127, 29, 29)"
                      : latestTriage.urgencyLevel === "URGENT"
                      ? "rgb(146, 64, 14)"
                      : latestTriage.urgencyLevel === "SEMI_URGENT"
                      ? "rgb(30, 58, 138)"
                      : "rgb(22, 101, 52)",
                  border: "3px solid #242622",
                  boxShadow: "0 3px 0 #242622",
                }}
              >
                {latestTriage.urgencyLevel.replace("_", " ")}
              </span>
            </div>

            <div>
              <p
                className="text-sm sm:text-base font-black uppercase tracking-wider mb-2 sm:mb-3 transition-colors duration-200"
                style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}
              >
                Recommendation
              </p>
              <p
                className="font-bold p-3 sm:p-4 rounded-lg text-sm sm:text-base md:text-lg"
                style={{
                  background:
                    theme === "dark"
                      ? "rgba(59, 130, 246, 0.15)"
                      : "rgb(219, 234, 254)",
                  color: theme === "dark" ? "#93c5fd" : "rgb(30, 58, 138)",
                  border: "2px solid #242622",
                }}
              >
                {latestTriage.recommendation}
              </p>
            </div>

            {latestTriage.redFlags && latestTriage.redFlags.length > 0 && (
              <div>
                <p
                  className="text-sm sm:text-base font-black uppercase tracking-wider mb-2 sm:mb-3"
                  style={{ color: "rgb(127, 29, 29)" }}
                >
                  ⚠️ Red Flags
                </p>
                <ul
                  className="list-disc list-inside space-y-1.5 sm:space-y-2 p-3 sm:p-4 rounded-lg text-sm sm:text-base font-bold"
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(239, 68, 68, 0.15)"
                        : "rgb(254, 226, 226)",
                    color: theme === "dark" ? "#fca5a5" : "rgb(127, 29, 29)",
                    border: "2px solid #242622",
                  }}
                >
                  {latestTriage.redFlags.map((flag, index) => (
                    <li key={index}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}

            {latestTriage.reasoning && latestTriage.reasoning.length > 0 && (
              <div>
                <p
                  className="text-sm sm:text-base font-black uppercase tracking-wider mb-2 sm:mb-3 transition-colors duration-200"
                  style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}
                >
                  Reasoning
                </p>
                <ul
                  className="list-disc list-inside space-y-1.5 sm:space-y-2 font-bold text-sm sm:text-base transition-colors duration-200"
                  style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
                >
                  {latestTriage.reasoning.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}

            {latestTriage.aiInsights && (
              <div>
                <p
                  className="text-sm sm:text-base font-black uppercase tracking-wider mb-2 sm:mb-3"
                  style={{
                    color: theme === "dark" ? "#c084fc" : "rgb(107, 33, 168)",
                  }}
                >
                  🤖 AI Insights
                </p>
                <p
                  className="font-bold p-3 sm:p-4 rounded-lg whitespace-pre-wrap text-sm sm:text-base"
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(168, 85, 247, 0.15)"
                        : "rgb(243, 232, 255)",
                    color: theme === "dark" ? "#c084fc" : "rgb(107, 33, 168)",
                    border: "2px solid #242622",
                  }}
                >
                  {latestTriage.aiInsights}
                </p>
              </div>
            )}

            {latestTriage.patternAnalysis && (
              <div>
                <p
                  className="text-sm sm:text-base font-black uppercase tracking-wider mb-2 sm:mb-3"
                  style={{
                    color: theme === "dark" ? "#93c5fd" : "rgb(30, 58, 138)",
                  }}
                >
                  📊 Pattern Analysis
                </p>
                <p
                  className="font-bold p-3 sm:p-4 rounded-lg whitespace-pre-wrap text-sm sm:text-base"
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(99, 102, 241, 0.15)"
                        : "rgb(224, 231, 255)",
                    color: theme === "dark" ? "#93c5fd" : "rgb(30, 58, 138)",
                    border: "2px solid #242622",
                  }}
                >
                  {latestTriage.patternAnalysis}
                </p>
              </div>
            )}

            <p
              className="text-xs sm:text-sm font-bold transition-colors duration-200"
              style={{ color: theme === "dark" ? "#6b7280" : "#9ca3af" }}
            >
              Assessed on {new Date(latestTriage.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Treatments */}
      {symptom.treatments && symptom.treatments.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
            Treatments
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {symptom.treatments.map((treatment) => (
              <div key={treatment.id} className="border rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      {treatment.treatmentType}
                    </h3>
                    {treatment.medicationName && (
                      <p className="text-gray-700 text-sm sm:text-base">
                        {treatment.medicationName}
                      </p>
                    )}
                  </div>
                  {treatment.effectivenessRating && (
                    <span className="text-xs sm:text-sm font-medium text-gray-600">
                      Effectiveness: {treatment.effectivenessRating}/10
                    </span>
                  )}
                </div>
                {(treatment.dosage || treatment.frequency) && (
                  <div className="text-xs sm:text-sm text-gray-600 mb-2">
                    {treatment.dosage && (
                      <span>Dosage: {treatment.dosage}</span>
                    )}
                    {treatment.dosage && treatment.frequency && (
                      <span> • </span>
                    )}
                    {treatment.frequency && (
                      <span>Frequency: {treatment.frequency}</span>
                    )}
                  </div>
                )}
                {treatment.sideEffects && treatment.sideEffects.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-700">
                      Side Effects:
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                      {treatment.sideEffects.map((effect, index) => (
                        <span
                          key={index}
                          className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-yellow-100 text-yellow-800 rounded text-xs sm:text-sm"
                        >
                          {effect}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {treatment.notes && (
                  <p className="text-xs sm:text-sm text-gray-700 mb-2">
                    {treatment.notes}
                  </p>
                )}
                <p className="text-[10px] sm:text-xs text-gray-500">
                  {new Date(treatment.startedAt).toLocaleDateString()}
                  {treatment.endedAt &&
                    ` - ${new Date(treatment.endedAt).toLocaleDateString()}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        <Button3D
          variant="blue"
          size="lg"
          onClick={() => router.push(`/dashboard/symptoms/${symptom.id}/edit`)}
          fullWidth
        >
          <span className="text-sm sm:text-base">Edit</span>
        </Button3D>
        <Button3D
          variant="red"
          size="lg"
          onClick={handleDelete}
          disabled={deleting}
          fullWidth
        >
          <span className="text-sm sm:text-base">
            {deleting ? "Deleting..." : "Delete"}
          </span>
        </Button3D>
      </div>
    </div>
  );
}
