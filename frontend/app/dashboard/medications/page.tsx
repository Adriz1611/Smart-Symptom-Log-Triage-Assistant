"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import apiClient from "@/lib/api/client";
import { useTheme } from "@/lib/theme/theme-context";
import Button3D from "@/components/ui/Button3D";

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
  const { theme } = useTheme();
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
        apiClient.get("/medications"),
        apiClient.get("/medications/stats?days=30"),
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
      await apiClient.post("/medications", {
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
      await apiClient.post(`/medications/logs/${logId}/intake`, {
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
    <div
      className="min-h-screen transition-colors duration-200"
      style={{ background: theme === "dark" ? "#0a0b0f" : "#f9fafb" }}
    >
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-7 md:mb-8">
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
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 transition-colors duration-200"
            style={{ color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)" }}
          >
            💊 Medication Tracker
          </h1>
          <p
            className="mt-1 sm:mt-2 text-sm sm:text-base transition-colors duration-200"
            style={{ color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)" }}
          >
            Track your medications and maintain adherence
          </p>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-6 sm:mb-7 md:mb-8">
            <div
              className="rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 transition-all duration-200 hover:-translate-y-1"
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
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-lg sm:text-xl md:text-2xl">💊</span>
                <span
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black"
                  style={{
                    color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                  }}
                >
                  {stats.totalMedications}
                </span>
              </div>
              <p
                className="font-black uppercase tracking-widest text-xs sm:text-sm transition-colors duration-200"
                style={{
                  color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                }}
              >
                Total Medications
              </p>
            </div>

            <div
              className="rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 transition-all duration-200 hover:-translate-y-1"
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
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-lg sm:text-xl md:text-2xl">✓</span>
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-green-600">
                  {stats.activeMedications}
                </span>
              </div>
              <p className="font-black uppercase tracking-widest text-xs sm:text-sm text-green-600">
                Active
              </p>
            </div>

            <div
              className="rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 transition-all duration-200 hover:-translate-y-1"
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
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-lg sm:text-xl md:text-2xl">📊</span>
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-blue-600">
                  {stats.adherenceRate}%
                </span>
              </div>
              <p className="font-black uppercase tracking-widest text-xs sm:text-sm text-blue-600">
                Adherence Rate
              </p>
              <div
                className="w-full rounded-full h-2.5 mt-2"
                style={{
                  background:
                    theme === "dark" ? "#2d3748" : "rgb(229, 231, 235)",
                }}
              >
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all"
                  style={{ width: `${stats.adherenceRate}%` }}
                ></div>
              </div>
            </div>

            <div
              className="rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 transition-all duration-200 hover:-translate-y-1"
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
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-lg sm:text-xl md:text-2xl">📅</span>
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-purple-600">
                  {stats.takenDoses}
                </span>
              </div>
              <p className="font-black uppercase tracking-widest text-xs sm:text-sm text-purple-600">
                Doses Taken (30d)
              </p>
            </div>
          </div>
        )}

        {/* Add Medication Button */}
        <div className="mb-4 sm:mb-5 md:mb-6">
          <Button3D
            variant="teal"
            size="md"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <span className="flex items-center text-sm sm:text-base">
              <span className="text-xl sm:text-2xl mr-2 sm:mr-3">+</span>
              <span>Add New Medication</span>
            </span>
          </Button3D>
        </div>

        {/* Add Medication Form */}
        {showAddForm && (
          <div
            className="rounded-xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-7 md:mb-8 transition-all duration-200"
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
              className="text-xl sm:text-2xl font-black mb-4 sm:mb-5 md:mb-6 transition-colors duration-200"
              style={{
                color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
              }}
            >
              Add New Medication
            </h2>
            <form
              onSubmit={handleAddMedication}
              className="space-y-4 sm:space-y-5 md:space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <div>
                  <label
                    className="block text-xs sm:text-sm font-black uppercase tracking-widest mb-1 sm:mb-2 transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                    }}
                  >
                    Medication Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder:text-gray-400 transition-all duration-200"
                    style={{
                      background: theme === "dark" ? "#252937" : "white",
                      border:
                        theme === "dark"
                          ? "3px solid #2d3748"
                          : "3px solid #242622",
                      color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                    }}
                    placeholder="e.g., Aspirin"
                  />
                </div>

                <div>
                  <label
                    className="block text-xs sm:text-sm font-black uppercase tracking-widest mb-1 sm:mb-2 transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                    }}
                  >
                    Dosage *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.dosage}
                    onChange={(e) =>
                      setFormData({ ...formData, dosage: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder:text-gray-400 transition-all duration-200"
                    style={{
                      background: theme === "dark" ? "#252937" : "white",
                      border:
                        theme === "dark"
                          ? "3px solid #2d3748"
                          : "3px solid #242622",
                      color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                    }}
                    placeholder="e.g., 500mg"
                  />
                </div>

                <div>
                  <label
                    className="block text-xs sm:text-sm font-black uppercase tracking-widest mb-1 sm:mb-2 transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                    }}
                  >
                    Frequency *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.frequency}
                    onChange={(e) =>
                      setFormData({ ...formData, frequency: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder:text-gray-400 transition-all duration-200"
                    style={{
                      background: theme === "dark" ? "#252937" : "white",
                      border:
                        theme === "dark"
                          ? "3px solid #2d3748"
                          : "3px solid #242622",
                      color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                    }}
                    placeholder="e.g., Twice daily"
                  />
                </div>

                <div>
                  <label
                    className="block text-xs sm:text-sm font-black uppercase tracking-widest mb-1 sm:mb-2 transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                    }}
                  >
                    Purpose
                  </label>
                  <input
                    type="text"
                    value={formData.purpose}
                    onChange={(e) =>
                      setFormData({ ...formData, purpose: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder:text-gray-400 transition-all duration-200"
                    style={{
                      background: theme === "dark" ? "#252937" : "white",
                      border:
                        theme === "dark"
                          ? "3px solid #2d3748"
                          : "3px solid #242622",
                      color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                    }}
                    placeholder="e.g., Pain relief"
                  />
                </div>

                <div>
                  <label
                    className="block text-xs sm:text-sm font-black uppercase tracking-widest mb-1 sm:mb-2 transition-colors duration-200"
                    style={{
                      color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                    }}
                  >
                    Prescribed By
                  </label>
                  <input
                    type="text"
                    value={formData.prescribedBy}
                    onChange={(e) =>
                      setFormData({ ...formData, prescribedBy: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder:text-gray-400 transition-all duration-200"
                    style={{
                      background: theme === "dark" ? "#252937" : "white",
                      border:
                        theme === "dark"
                          ? "3px solid #2d3748"
                          : "3px solid #242622",
                      color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                    }}
                    placeholder="e.g., Dr. Smith"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-xs sm:text-sm font-black uppercase tracking-widest mb-1 sm:mb-2 transition-colors duration-200"
                  style={{
                    color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                  }}
                >
                  Daily Time Slots
                </label>
                {formData.timeSlots.map((slot, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="time"
                      value={slot}
                      onChange={(e) => updateTimeSlot(index, e.target.value)}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder:text-gray-400 transition-all duration-200"
                      style={{
                        background: theme === "dark" ? "#252937" : "white",
                        border:
                          theme === "dark"
                            ? "3px solid #2d3748"
                            : "3px solid #242622",
                        color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                      }}
                    />
                    {formData.timeSlots.length > 1 && (
                      <Button3D
                        type="button"
                        variant="red"
                        size="sm"
                        onClick={() => removeTimeSlot(index)}
                      >
                        ✕
                      </Button3D>
                    )}
                  </div>
                ))}
                <Button3D
                  type="button"
                  variant="teal"
                  size="sm"
                  onClick={addTimeSlot}
                  className="mt-2"
                >
                  + Add Time Slot
                </Button3D>
              </div>

              <div>
                <label
                  className="block text-xs sm:text-sm font-black uppercase tracking-widest mb-1 sm:mb-2 transition-colors duration-200"
                  style={{
                    color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                  }}
                >
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder:text-gray-400 transition-all duration-200"
                  style={{
                    background: theme === "dark" ? "#252937" : "white",
                    border:
                      theme === "dark"
                        ? "3px solid #2d3748"
                        : "3px solid #242622",
                    color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                  }}
                  placeholder="Any additional notes..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button3D type="submit" variant="teal" size="md">
                  Add Medication
                </Button3D>
                <Button3D
                  type="button"
                  variant="white"
                  size="md"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button3D>
              </div>
            </form>
          </div>
        )}

        {/* Medications List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 border-4 border-teal-200 border-t-teal-600"></div>
          </div>
        ) : medications.length === 0 ? (
          <div
            className="rounded-xl p-8 sm:p-10 md:p-12 text-center transition-all duration-200"
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
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
              style={{
                background: theme === "dark" ? "#2d3748" : "rgb(243, 244, 246)",
              }}
            >
              <span className="text-2xl sm:text-3xl md:text-4xl">💊</span>
            </div>
            <p
              className="text-base sm:text-lg mb-3 sm:mb-4 transition-colors duration-200"
              style={{
                color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
              }}
            >
              No medications tracked yet
            </p>
            <Button3D
              variant="teal"
              size="md"
              onClick={() => setShowAddForm(true)}
            >
              <span className="flex items-center">
                Add your first medication
                <span className="ml-2">→</span>
              </span>
            </Button3D>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {medications.map((med) => (
              <div
                key={med.id}
                className="rounded-xl p-4 sm:p-5 md:p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
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
                    theme === "dark" ? "0 4px 0 #2d3748" : "0 4px 0 #242622",
                }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 flex-wrap">
                      <h3
                        className="text-lg sm:text-xl md:text-2xl font-black transition-colors duration-200"
                        style={{
                          color:
                            theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
                        }}
                      >
                        {med.name}
                      </h3>
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${getStatusColor(
                          med.status
                        )}`}
                        style={{
                          border: "3px solid",
                          boxShadow: "0 3px 0",
                        }}
                      >
                        {med.status}
                      </span>
                    </div>
                    <p
                      className="text-sm sm:text-base font-bold transition-colors duration-200"
                      style={{
                        color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                      }}
                    >
                      <span className="font-black">{med.dosage}</span> •{" "}
                      {med.frequency}
                    </p>
                    {med.purpose && (
                      <p
                        className="text-xs sm:text-sm mt-1 transition-colors duration-200"
                        style={{
                          color:
                            theme === "dark" ? "#6b7280" : "rgb(107, 114, 128)",
                        }}
                      >
                        Purpose: {med.purpose}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p
                      className="text-sm transition-colors duration-200"
                      style={{
                        color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                      }}
                    >
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
                  <div
                    className="pt-3 sm:pt-4"
                    style={{
                      borderTop:
                        theme === "dark"
                          ? "2px solid #2d3748"
                          : "2px solid #e5e7eb",
                    }}
                  >
                    <h4
                      className="text-xs sm:text-sm font-black uppercase tracking-widest mb-2 sm:mb-3 transition-colors duration-200"
                      style={{
                        color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)",
                      }}
                    >
                      Today's Schedule
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                      {med.logs.map((log) => (
                        <div
                          key={log.id}
                          className={`rounded-xl p-2 sm:p-3 transition-all duration-200 ${getLogStatusColor(
                            log.status
                          )}`}
                          style={{
                            border: "3px solid",
                            boxShadow: "0 3px 0",
                          }}
                        >
                          <div
                            className="text-xs sm:text-sm font-black mb-1 sm:mb-2 transition-colors duration-200"
                            style={{
                              color:
                                theme === "dark"
                                  ? "#e5e7eb"
                                  : "rgb(17, 24, 39)",
                            }}
                          >
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
                              <Button3D
                                variant="green"
                                size="sm"
                                onClick={() => handleLogIntake(log.id, "TAKEN")}
                                className="flex-1 px-2! py-1! text-xs"
                              >
                                ✓
                              </Button3D>
                              <Button3D
                                variant="white"
                                size="sm"
                                onClick={() =>
                                  handleLogIntake(log.id, "SKIPPED")
                                }
                                className="flex-1 px-2! py-1! text-xs"
                              >
                                ✕
                              </Button3D>
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
