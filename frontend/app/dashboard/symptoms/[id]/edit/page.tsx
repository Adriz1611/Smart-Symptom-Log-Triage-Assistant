"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { symptomApi } from "@/lib/api/symptoms";
import { Symptom } from "@/lib/types";
import { useTheme } from "@/lib/theme/theme-context";
import Button3D from "@/components/ui/Button3D";

export default function EditSymptomPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [symptom, setSymptom] = useState<Symptom | null>(null);

  const [formData, setFormData] = useState({
    symptomName: "",
    bodyLocation: "",
    severity: 5,
    status: "ACTIVE" as
      | "ACTIVE"
      | "RESOLVED"
      | "IMPROVING"
      | "WORSENING"
      | "MONITORING",
    characteristic: "",
    frequency: "",
    notes: "",
    temperature: "",
    heartRate: "",
    bloodPressure: "",
    triggers: "",
    alleviatingFactors: "",
    aggravatingFactors: "",
  });

  useEffect(() => {
    const fetchSymptom = async () => {
      try {
        const response = await symptomApi.getById(params.id as string);
        if (response.success && response.data) {
          const s = response.data;
          setSymptom(s);
          setFormData({
            symptomName: s.symptomName,
            bodyLocation: s.bodyLocation || "",
            severity: s.severity,
            status: s.status,
            characteristic: s.details?.characteristic || "",
            frequency: s.details?.frequency || "",
            notes: s.details?.notes || "",
            temperature: s.details?.temperature?.toString() || "",
            heartRate: s.details?.heartRate?.toString() || "",
            bloodPressure: s.details?.bloodPressure || "",
            triggers: s.details?.triggers?.join(", ") || "",
            alleviatingFactors: s.details?.alleviatingFactors?.join(", ") || "",
            aggravatingFactors: s.details?.aggravatingFactors?.join(", ") || "",
          });
        } else {
          setError("Failed to load symptom");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load symptom");
      } finally {
        setFetchLoading(false);
      }
    };

    if (params.id) {
      fetchSymptom();
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await symptomApi.update(params.id as string, {
        symptomName: formData.symptomName,
        bodyLocation: formData.bodyLocation || undefined,
        severity: formData.severity,
        status: formData.status,
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
          bloodPressure: formData.bloodPressure || undefined,
          triggers: formData.triggers
            ? formData.triggers
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t)
            : undefined,
          alleviatingFactors: formData.alleviatingFactors
            ? formData.alleviatingFactors
                .split(",")
                .map((f) => f.trim())
                .filter((f) => f)
            : undefined,
          aggravatingFactors: formData.aggravatingFactors
            ? formData.aggravatingFactors
                .split(",")
                .map((f) => f.trim())
                .filter((f) => f)
            : undefined,
        },
      });

      if (response.success) {
        router.push(`/dashboard/symptoms/${params.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update symptom");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">
            Loading symptom...
          </p>
        </div>
      </div>
    );
  }

  if (error && !symptom) {
    return (
      <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
          <p className="text-red-800 text-sm sm:text-base">{error}</p>
          <div className="mt-3 sm:mt-4">
            <Button3D
              variant="white"
              size="sm"
              onClick={() => router.push("/dashboard")}
            >
              <span className="text-xs sm:text-sm">← Back</span>
            </Button3D>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="mb-4 sm:mb-6 md:mb-8">
        <div className="mb-3 sm:mb-4">
          <Button3D
            variant="white"
            size="sm"
            onClick={() => router.push(`/dashboard/symptoms/${params.id}`)}
          >
            <span className="text-xs sm:text-sm">← Back</span>
          </Button3D>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Edit Symptom
        </h1>
        <p className="text-gray-600 mt-1.5 sm:mt-2 text-sm sm:text-base">
          Update symptom information and status
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

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
          >
            Status *
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as typeof formData.status,
              })
            }
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-800 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
          >
            <option value="ACTIVE">Active</option>
            <option value="IMPROVING">Improving</option>
            <option value="WORSENING">Worsening</option>
            <option value="MONITORING">Monitoring</option>
            <option value="RESOLVED">Resolved</option>
          </select>
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

        {/* Triggers */}
        <div>
          <label
            htmlFor="triggers"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
          >
            Triggers <span className="hidden xs:inline">(comma-separated)</span>
          </label>
          <input
            id="triggers"
            type="text"
            value={formData.triggers}
            onChange={(e) =>
              setFormData({ ...formData, triggers: e.target.value })
            }
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-800 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
            placeholder="e.g., stress, lack of sleep"
          />
        </div>

        {/* Alleviating Factors */}
        <div>
          <label
            htmlFor="alleviatingFactors"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
          >
            Alleviating{" "}
            <span className="hidden xs:inline">Factors (comma-separated)</span>
          </label>
          <input
            id="alleviatingFactors"
            type="text"
            value={formData.alleviatingFactors}
            onChange={(e) =>
              setFormData({ ...formData, alleviatingFactors: e.target.value })
            }
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-800 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
            placeholder="e.g., rest, medication"
          />
        </div>

        {/* Aggravating Factors */}
        <div>
          <label
            htmlFor="aggravatingFactors"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
          >
            Aggravating{" "}
            <span className="hidden xs:inline">Factors (comma-separated)</span>
          </label>
          <input
            id="aggravatingFactors"
            type="text"
            value={formData.aggravatingFactors}
            onChange={(e) =>
              setFormData({ ...formData, aggravatingFactors: e.target.value })
            }
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-800 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
            placeholder="e.g., movement, bright lights"
          />
        </div>

        {/* Vital Signs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label
              htmlFor="temperature"
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
            >
              Temp (°F)
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
              HR (bpm)
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
          <div>
            <label
              htmlFor="bloodPressure"
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
            >
              BP
            </label>
            <input
              id="bloodPressure"
              type="text"
              value={formData.bloodPressure}
              onChange={(e) =>
                setFormData({ ...formData, bloodPressure: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-800 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
              placeholder="120/80"
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
            placeholder="Any additional details..."
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 sm:pt-4 grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
          <Button3D
            type="button"
            variant="white"
            size="lg"
            onClick={() => router.push(`/dashboard/symptoms/${params.id}`)}
            fullWidth
          >
            <span className="text-sm sm:text-base">Cancel</span>
          </Button3D>
          <Button3D
            type="submit"
            variant="blue"
            size="lg"
            disabled={loading}
            fullWidth
          >
            <span className="text-sm sm:text-base">
              {loading ? "Updating..." : "Update"}
            </span>
          </Button3D>
        </div>
      </form>
    </div>
  );
}
