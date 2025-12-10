"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { symptomApi } from "@/lib/api/symptoms";
import { useTheme } from "@/lib/theme/theme-context";
import Button3D from "@/components/ui/Button3D";

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
    <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="mb-4 sm:mb-6 md:mb-8">
        <Button3D
          variant="white"
          size="sm"
          onClick={() => router.back()}
          className="mb-3 sm:mb-4"
        >
          <span className="text-xs sm:text-sm">← Back</span>
        </Button3D>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Log New Symptom
        </h1>
        <p className="text-gray-600 mt-1.5 sm:mt-2 text-sm sm:text-base">
          Provide detailed information to get an accurate triage assessment
        </p>
      </div>

      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm sm:text-base">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg sm:rounded-xl shadow-sm border-2 border-gray-800 p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6"
        style={{ boxShadow: "4px 4px 0px #242622" }}
      >
        {/* Symptom Name */}
        <div>
          <label
            htmlFor="symptomName"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
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
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-800 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
            placeholder="e.g., Headache, Fever, Chest pain"
          />
        </div>

        {/* Body Location */}
        <div>
          <label
            htmlFor="bodyLocation"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
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
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-800 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
            placeholder="e.g., Head, Chest, Abdomen"
          />
        </div>

        {/* Severity */}
        <div>
          <label
            htmlFor="severity"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
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
          <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mt-1">
            <span>1 (Mild)</span>
            <span>5 (Moderate)</span>
            <span>10 (Severe)</span>
          </div>
        </div>

        {/* Characteristic */}
        <div>
          <label
            htmlFor="characteristic"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
          >
            Characteristic
          </label>
          <select
            id="characteristic"
            value={formData.characteristic}
            onChange={(e) =>
              setFormData({ ...formData, characteristic: e.target.value })
            }
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-800 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
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
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
          >
            Frequency
          </label>
          <select
            id="frequency"
            value={formData.frequency}
            onChange={(e) =>
              setFormData({ ...formData, frequency: e.target.value })
            }
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-800 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
          >
            <option value="">Select...</option>
            <option value="constant">Constant</option>
            <option value="intermittent">Intermittent</option>
            <option value="occasional">Occasional</option>
            <option value="once">Just once</option>
          </select>
        </div>

        {/* Vital Signs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label
              htmlFor="temperature"
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
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
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-800 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
              placeholder="98.6"
            />
          </div>
          <div>
            <label
              htmlFor="heartRate"
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
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
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-800 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
              placeholder="70"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
          >
            Additional Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-800 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
            placeholder="Any additional details, triggers, or context..."
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 sm:pt-4">
          <Button3D
            type="submit"
            disabled={loading}
            variant="blue"
            size="lg"
            fullWidth
          >
            <span className="text-sm sm:text-base">
              {loading ? "Logging..." : "Log Symptom & Get Assessment"}
            </span>
          </Button3D>
        </div>
      </form>
    </div>
  );
}
