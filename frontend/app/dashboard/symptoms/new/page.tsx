"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { symptomApi } from "@/lib/api/symptoms";

export default function NewSymptomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    symptomName: "",
    bodyLocation: "",
    severity: 5,
    characteristic: "",
    frequency: "",
    notes: "",
    temperature: "",
    heartRate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await symptomApi.create({
        symptomName: formData.symptomName,
        bodyLocation: formData.bodyLocation || undefined,
        severity: formData.severity,
        details: {
          characteristic: formData.characteristic || undefined,
          frequency: formData.frequency || undefined,
          notes: formData.notes || undefined,
          temperature: formData.temperature
            ? parseFloat(formData.temperature)
            : undefined,
          heartRate: formData.heartRate
            ? parseInt(formData.heartRate)
            : undefined,
        },
      });

      if (response.success) {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to log symptom");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Log New Symptom</h1>
        <p className="text-gray-600 mt-2">
          Provide detailed information to get an accurate triage assessment
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
      >
        {/* Symptom Name */}
        <div>
          <label
            htmlFor="symptomName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Symptom Name *
          </label>
          <input
            id="symptomName"
            type="text"
            required
            value={formData.symptomName}
            onChange={(e) =>
              setFormData({ ...formData, symptomName: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Headache, Fever, Chest pain"
          />
        </div>

        {/* Body Location */}
        <div>
          <label
            htmlFor="bodyLocation"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Body Location
          </label>
          <input
            id="bodyLocation"
            type="text"
            value={formData.bodyLocation}
            onChange={(e) =>
              setFormData({ ...formData, bodyLocation: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Head, Chest, Abdomen"
          />
        </div>

        {/* Severity */}
        <div>
          <label
            htmlFor="severity"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Severity: {formData.severity}/10 *
          </label>
          <input
            id="severity"
            type="range"
            min="1"
            max="10"
            value={formData.severity}
            onChange={(e) =>
              setFormData({ ...formData, severity: parseInt(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 (Mild)</span>
            <span>5 (Moderate)</span>
            <span>10 (Severe)</span>
          </div>
        </div>

        {/* Characteristic */}
        <div>
          <label
            htmlFor="characteristic"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Characteristic
          </label>
          <select
            id="characteristic"
            value={formData.characteristic}
            onChange={(e) =>
              setFormData({ ...formData, characteristic: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select...</option>
            <option value="sharp">Sharp</option>
            <option value="dull">Dull</option>
            <option value="throbbing">Throbbing</option>
            <option value="burning">Burning</option>
            <option value="stabbing">Stabbing</option>
            <option value="aching">Aching</option>
          </select>
        </div>

        {/* Frequency */}
        <div>
          <label
            htmlFor="frequency"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Frequency
          </label>
          <select
            id="frequency"
            value={formData.frequency}
            onChange={(e) =>
              setFormData({ ...formData, frequency: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select...</option>
            <option value="constant">Constant</option>
            <option value="intermittent">Intermittent</option>
            <option value="occasional">Occasional</option>
            <option value="once">Just once</option>
          </select>
        </div>

        {/* Vital Signs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="temperature"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Temperature (°F)
            </label>
            <input
              id="temperature"
              type="number"
              step="0.1"
              value={formData.temperature}
              onChange={(e) =>
                setFormData({ ...formData, temperature: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="98.6"
            />
          </div>
          <div>
            <label
              htmlFor="heartRate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Heart Rate (bpm)
            </label>
            <input
              id="heartRate"
              type="number"
              value={formData.heartRate}
              onChange={(e) =>
                setFormData({ ...formData, heartRate: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="70"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Additional Notes
          </label>
          <textarea
            id="notes"
            rows={4}
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any additional details, triggers, or context..."
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Logging Symptom..." : "Log Symptom & Get Assessment"}
          </button>
        </div>
      </form>
    </div>
  );
}
