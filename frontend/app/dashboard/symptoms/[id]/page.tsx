"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { symptomApi } from "@/lib/api/symptoms";
import { Symptom } from "@/lib/types";

export default function SymptomDetailPage() {
  const params = useParams();
  const router = useRouter();
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading symptom details...</p>
        </div>
      </div>
    );
  }

  if (error || !symptom) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error || "Symptom not found"}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const latestTriage = symptom.triageAssessments?.[0];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-blue-600 hover:underline mb-4 flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {symptom.symptomName}
            </h1>
            {symptom.bodyLocation && (
              <p className="text-gray-600 mt-1">
                Location: {symptom.bodyLocation}
              </p>
            )}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              symptom.status
            )}`}
          >
            {symptom.status}
          </span>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Severity</p>
            <p
              className={`text-2xl font-bold ${getSeverityColor(
                symptom.severity
              )}`}
            >
              {symptom.severity}/10
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Started</p>
            <p className="text-lg font-medium text-gray-900">
              {new Date(symptom.startedAt).toLocaleDateString()}
            </p>
          </div>
          {symptom.endedAt && (
            <div>
              <p className="text-sm text-gray-600">Ended</p>
              <p className="text-lg font-medium text-gray-900">
                {new Date(symptom.endedAt).toLocaleDateString()}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600">Duration</p>
            <p className="text-lg font-medium text-gray-900">
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
          <div className="border-t pt-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Vital Signs
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {symptom.details.temperature && (
                <div>
                  <p className="text-sm text-gray-600">Temperature</p>
                  <p className="text-lg font-medium text-gray-900">
                    {symptom.details.temperature}°F
                  </p>
                </div>
              )}
              {symptom.details.heartRate && (
                <div>
                  <p className="text-sm text-gray-600">Heart Rate</p>
                  <p className="text-lg font-medium text-gray-900">
                    {symptom.details.heartRate} bpm
                  </p>
                </div>
              )}
              {symptom.details.bloodPressure && (
                <div>
                  <p className="text-sm text-gray-600">Blood Pressure</p>
                  <p className="text-lg font-medium text-gray-900">
                    {symptom.details.bloodPressure}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Symptom Details */}
        {symptom.details && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Details
            </h3>
            <div className="space-y-3">
              {symptom.details.characteristic && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Characteristic
                  </p>
                  <p className="text-gray-900">
                    {symptom.details.characteristic}
                  </p>
                </div>
              )}
              {symptom.details.frequency && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Frequency</p>
                  <p className="text-gray-900">{symptom.details.frequency}</p>
                </div>
              )}
              {symptom.details.triggers &&
                symptom.details.triggers.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Triggers
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {symptom.details.triggers.map((trigger, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm"
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
                    <p className="text-sm font-medium text-gray-700">
                      Alleviating Factors
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {symptom.details.alleviatingFactors.map(
                        (factor, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
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
                    <p className="text-sm font-medium text-gray-700">
                      Aggravating Factors
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {symptom.details.aggravatingFactors.map(
                        (factor, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm"
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
                  <p className="text-sm font-medium text-gray-700">Notes</p>
                  <p className="text-gray-900 whitespace-pre-wrap">
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
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Triage Assessment
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-2 rounded-lg font-semibold ${getUrgencyColor(
                  latestTriage.urgencyLevel
                )}`}
              >
                {latestTriage.urgencyLevel.replace("_", " ")}
              </span>
              <span className="text-gray-600">Score: {latestTriage.score}</span>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Recommendation
              </p>
              <p className="text-gray-900 bg-blue-50 p-3 rounded">
                {latestTriage.recommendation}
              </p>
            </div>

            {latestTriage.redFlags && latestTriage.redFlags.length > 0 && (
              <div>
                <p className="text-sm font-medium text-red-700 mb-2">
                  ⚠️ Red Flags
                </p>
                <ul className="list-disc list-inside space-y-1 text-red-900 bg-red-50 p-3 rounded">
                  {latestTriage.redFlags.map((flag, index) => (
                    <li key={index}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}

            {latestTriage.reasoning && latestTriage.reasoning.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Reasoning
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-900">
                  {latestTriage.reasoning.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}

            {latestTriage.aiInsights && (
              <div>
                <p className="text-sm font-medium text-purple-700 mb-2">
                  🤖 AI Insights
                </p>
                <p className="text-gray-900 bg-purple-50 p-3 rounded whitespace-pre-wrap">
                  {latestTriage.aiInsights}
                </p>
              </div>
            )}

            {latestTriage.patternAnalysis && (
              <div>
                <p className="text-sm font-medium text-indigo-700 mb-2">
                  📊 Pattern Analysis
                </p>
                <p className="text-gray-900 bg-indigo-50 p-3 rounded whitespace-pre-wrap">
                  {latestTriage.patternAnalysis}
                </p>
              </div>
            )}

            <p className="text-xs text-gray-500">
              Assessed on {new Date(latestTriage.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Treatments */}
      {symptom.treatments && symptom.treatments.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Treatments</h2>
          <div className="space-y-4">
            {symptom.treatments.map((treatment) => (
              <div key={treatment.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {treatment.treatmentType}
                    </h3>
                    {treatment.medicationName && (
                      <p className="text-gray-700">
                        {treatment.medicationName}
                      </p>
                    )}
                  </div>
                  {treatment.effectivenessRating && (
                    <span className="text-sm font-medium text-gray-600">
                      Effectiveness: {treatment.effectivenessRating}/10
                    </span>
                  )}
                </div>
                {(treatment.dosage || treatment.frequency) && (
                  <div className="text-sm text-gray-600 mb-2">
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
                    <p className="text-sm font-medium text-gray-700">
                      Side Effects:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {treatment.sideEffects.map((effect, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm"
                        >
                          {effect}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {treatment.notes && (
                  <p className="text-sm text-gray-700 mb-2">
                    {treatment.notes}
                  </p>
                )}
                <p className="text-xs text-gray-500">
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
      <div className="flex gap-4">
        <button
          onClick={() => router.push(`/dashboard/symptoms/${symptom.id}/edit`)}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Edit Symptom
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400"
        >
          {deleting ? "Deleting..." : "Delete Symptom"}
        </button>
      </div>
    </div>
  );
}
