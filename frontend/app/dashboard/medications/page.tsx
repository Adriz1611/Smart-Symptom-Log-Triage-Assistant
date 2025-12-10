"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import apiClient from "@/lib/api/client";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeSlots: string[];
  startDate: string;
  endDate: string | null;
  purpose: string | null;
  prescribedBy: string | null;
  sideEffects: string[];
  notes: string | null;
  reminderEnabled: boolean;
  status: "ACTIVE" | "PAUSED" | "COMPLETED" | "DISCONTINUED";
  createdAt: string;
  logs: MedicationLog[];
}

interface MedicationLog {
  id: string;
  scheduledTime: string;
  takenAt: string | null;
  status: "PENDING" | "TAKEN" | "MISSED" | "SKIPPED";
  effectiveness: number | null;
}

interface MedicationStats {
  totalMedications: number;
  activeMedications: number;
  adherenceRate: number;
  takenDoses: number;
  missedDoses: number;
}

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [stats, setStats] = useState<MedicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    timeSlots: [""],
    purpose: "",
    prescribedBy: "",
    notes: "",
    reminderEnabled: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [medsResponse, statsResponse] = await Promise.all([
        apiClient.get("/api/medications"),
        apiClient.get("/api/medications/stats?days=30"),
      ]);
      setMedications(medsResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error("Failed to fetch medications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post("/api/medications", {
        ...formData,
        timeSlots: formData.timeSlots.filter((t) => t.trim() !== ""),
      });
      setShowAddForm(false);
      setFormData({
        name: "",
        dosage: "",
        frequency: "",
        timeSlots: [""],
        purpose: "",
        prescribedBy: "",
        notes: "",
        reminderEnabled: true,
      });
      fetchData();
    } catch (error) {
      console.error("Failed to add medication:", error);
    }
  };

  const handleLogIntake = async (logId: string, status: string) => {
    try {
      await apiClient.post(`/api/medications/logs/${logId}/intake`, {
        status,
        effectiveness: status === "TAKEN" ? 3 : null,
      });
      fetchData();
    } catch (error) {
      console.error("Failed to log intake:", error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      ACTIVE: "bg-green-100 text-green-700 border-green-300",
      PAUSED: "bg-yellow-100 text-yellow-700 border-yellow-300",
      COMPLETED: "bg-blue-100 text-blue-700 border-blue-300",
      DISCONTINUED: "bg-gray-100 text-gray-700 border-gray-300",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  const getLogStatusColor = (status: string) => {
    const colors = {
      PENDING: "bg-blue-50 border-blue-200",
      TAKEN: "bg-green-50 border-green-200",
      MISSED: "bg-red-50 border-red-200",
      SKIPPED: "bg-gray-50 border-gray-200",
    };
    return colors[status as keyof typeof colors] || "bg-gray-50";
  };

  const addTimeSlot = () => {
    setFormData({ ...formData, timeSlots: [...formData.timeSlots, ""] });
  };

  const updateTimeSlot = (index: number, value: string) => {
    const newTimeSlots = [...formData.timeSlots];
    newTimeSlots[index] = value;
    setFormData({ ...formData, timeSlots: newTimeSlots });
  };

  const removeTimeSlot = (index: number) => {
    const newTimeSlots = formData.timeSlots.filter((_, i) => i !== index);
    setFormData({ ...formData, timeSlots: newTimeSlots });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-2 transition-colors"
          >
            <span className="mr-2">←</span>
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold bg-linear-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Medication Tracker
          </h1>
          <p className="text-gray-600 mt-2">
            Track your medications and maintain adherence
          </p>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💊</span>
                </div>
                <span className="text-3xl font-bold text-gray-900">
                  {stats.totalMedications}
                </span>
              </div>
              <p className="text-gray-600 font-medium">Total Medications</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <span className="text-3xl font-bold text-green-600">
                  {stats.activeMedications}
                </span>
              </div>
              <p className="text-gray-600 font-medium">Active</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <span className="text-3xl font-bold text-blue-600">
                  {stats.adherenceRate}%
                </span>
              </div>
              <p className="text-gray-600 font-medium">Adherence Rate</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <span className="text-3xl font-bold text-purple-600">
                  {stats.takenDoses}
                </span>
              </div>
              <p className="text-gray-600 font-medium">Doses Taken (30d)</p>
            </div>
          </div>
        )}

        {/* Add Medication Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="group relative inline-flex items-center px-8 py-4 bg-linear-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-2xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span className="text-2xl mr-3 group-hover:rotate-90 transition-transform duration-300">
              +
            </span>
            <span>Add New Medication</span>
          </button>
        </div>

        {/* Add Medication Form */}
        {showAddForm && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Add New Medication
            </h2>
            <form onSubmit={handleAddMedication} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Medication Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="e.g., Aspirin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dosage *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.dosage}
                    onChange={(e) =>
                      setFormData({ ...formData, dosage: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="e.g., 500mg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Frequency *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.frequency}
                    onChange={(e) =>
                      setFormData({ ...formData, frequency: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="e.g., Twice daily"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Purpose
                  </label>
                  <input
                    type="text"
                    value={formData.purpose}
                    onChange={(e) =>
                      setFormData({ ...formData, purpose: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="e.g., Pain relief"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prescribed By
                  </label>
                  <input
                    type="text"
                    value={formData.prescribedBy}
                    onChange={(e) =>
                      setFormData({ ...formData, prescribedBy: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="e.g., Dr. Smith"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Daily Time Slots
                </label>
                {formData.timeSlots.map((slot, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="time"
                      value={slot}
                      onChange={(e) => updateTimeSlot(index, e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                    {formData.timeSlots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(index)}
                        className="px-4 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTimeSlot}
                  className="mt-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-xl hover:bg-teal-200 transition-colors text-sm font-medium"
                >
                  + Add Time Slot
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Any additional notes..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors"
                >
                  Add Medication
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Medications List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-200 border-t-teal-600"></div>
          </div>
        ) : medications.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">💊</span>
            </div>
            <p className="text-gray-600 text-lg mb-4">
              No medications tracked yet
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center text-teal-600 hover:text-teal-700 font-semibold"
            >
              Add your first medication
              <span className="ml-2">→</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {medications.map((med) => (
              <div
                key={med.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {med.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          med.status
                        )}`}
                      >
                        {med.status}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      <span className="font-semibold">{med.dosage}</span> •{" "}
                      {med.frequency}
                    </p>
                    {med.purpose && (
                      <p className="text-sm text-gray-500 mt-1">
                        Purpose: {med.purpose}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Since{" "}
                      {new Date(med.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Today's Schedule */}
                {med.logs.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Today's Schedule
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {med.logs.map((log) => (
                        <div
                          key={log.id}
                          className={`border-2 rounded-xl p-3 ${getLogStatusColor(
                            log.status
                          )}`}
                        >
                          <div className="text-sm font-semibold text-gray-900 mb-2">
                            {new Date(log.scheduledTime).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                          {log.status === "PENDING" ? (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleLogIntake(log.id, "TAKEN")}
                                className="flex-1 px-2 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() =>
                                  handleLogIntake(log.id, "SKIPPED")
                                }
                                className="flex-1 px-2 py-1 bg-gray-400 text-white text-xs rounded-lg hover:bg-gray-500 transition-colors"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="text-xs font-medium text-gray-700">
                              {log.status === "TAKEN" && "✓ Taken"}
                              {log.status === "MISSED" && "✗ Missed"}
                              {log.status === "SKIPPED" && "— Skipped"}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
