"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { useTheme } from "@/lib/theme/theme-context";
import Link from "next/link";
import Button3D from "@/components/ui/Button3D";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // Validate password requirements
    const hasUppercase = /[A-Z]/.test(formData.password);
    const hasLowercase = /[a-z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);

    if (!hasUppercase || !hasLowercase || !hasNumber) {
      setError("Password must contain uppercase, lowercase, and number");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth || undefined,
      });
    } catch (err: any) {
      console.error("Registration error:", err);
      const errorMessage =
        err.message ||
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registration failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-3 sm:px-4 transition-colors duration-200"
      style={{ background: theme === "dark" ? "#0a0b0f" : "#fffef9" }}
    >
      <div
        className="max-w-md w-full rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 transition-colors duration-200"
        style={{
          background: theme === "dark" ? "#1a1d29" : "white",
          border: theme === "dark" ? "2px solid #2d3748" : "2px solid #242622",
          boxShadow:
            theme === "dark" ? "4px 4px 0px #2d3748" : "4px 4px 0px #242622",
        }}
      >
        <div className="text-center mb-6 sm:mb-8">
          <div
            className="inline-flex w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl items-center justify-center mb-3 sm:mb-4"
            style={{
              background: "rgb(147, 197, 253)",
              border: "2px solid #242622",
              boxShadow: "4px 4px 0px #242622",
            }}
          >
            <span
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: "rgb(30, 58, 138)" }}
            >
              +
            </span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold transition-colors duration-200"
            style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
          >
            Create Account
          </h1>
          <p
            className="mt-1.5 sm:mt-2 text-sm sm:text-base font-medium transition-colors duration-200"
            style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}
          >
            Start tracking your health today
          </p>
        </div>

        {error && (
          <div
            className="mb-3 sm:mb-4 p-3 sm:p-4 rounded-lg sm:rounded-xl text-sm sm:text-base"
            style={{
              background: "rgb(254, 226, 226)",
              border: "2px solid rgb(220, 38, 38)",
              color: "rgb(127, 29, 29)",
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 transition-colors duration-200"
              style={{
                color: theme === "dark" ? "#e5e7eb" : "rgb(55, 65, 81)",
              }}
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-colors duration-200"
              style={{
                border:
                  theme === "dark"
                    ? "2px solid #2d3748"
                    : "2px solid rgb(31, 41, 55)",
                background: theme === "dark" ? "#0a0b0f" : "white",
                color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
              }}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 transition-colors duration-200"
              style={{
                color: theme === "dark" ? "#e5e7eb" : "rgb(55, 65, 81)",
              }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-colors duration-200"
              style={{
                border:
                  theme === "dark"
                    ? "2px solid #2d3748"
                    : "2px solid rgb(31, 41, 55)",
                background: theme === "dark" ? "#0a0b0f" : "white",
                color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
              }}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 transition-colors duration-200"
              style={{
                color: theme === "dark" ? "#e5e7eb" : "rgb(55, 65, 81)",
              }}
            >
              Date of Birth <span className="hidden xs:inline">(Optional)</span>
            </label>
            <input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-colors duration-200"
              style={{
                border:
                  theme === "dark"
                    ? "2px solid #2d3748"
                    : "2px solid rgb(31, 41, 55)",
                background: theme === "dark" ? "#0a0b0f" : "white",
                color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 transition-colors duration-200"
              style={{
                color: theme === "dark" ? "#e5e7eb" : "rgb(55, 65, 81)",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-colors duration-200"
              style={{
                border:
                  theme === "dark"
                    ? "2px solid #2d3748"
                    : "2px solid rgb(31, 41, 55)",
                background: theme === "dark" ? "#0a0b0f" : "white",
                color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
              }}
              placeholder="••••••••"
            />
            <p
              className="text-[10px] sm:text-xs mt-1 transition-colors duration-200"
              style={{
                color: theme === "dark" ? "#6b7280" : "rgb(107, 114, 128)",
              }}
            >
              Must be 8+ characters with uppercase, lowercase, and number
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 transition-colors duration-200"
              style={{
                color: theme === "dark" ? "#e5e7eb" : "rgb(55, 65, 81)",
              }}
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-colors duration-200"
              style={{
                border:
                  theme === "dark"
                    ? "2px solid #2d3748"
                    : "2px solid rgb(31, 41, 55)",
                background: theme === "dark" ? "#0a0b0f" : "white",
                color: theme === "dark" ? "#e5e7eb" : "rgb(17, 24, 39)",
              }}
              placeholder="••••••••"
            />
          </div>

          <Button3D
            type="submit"
            disabled={loading}
            variant="green"
            size="lg"
            fullWidth
          >
            <span className="text-sm sm:text-base">
              {loading ? "Creating account..." : "Create Account"}
            </span>
          </Button3D>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <p
            className="text-sm sm:text-base transition-colors duration-200"
            style={{ color: theme === "dark" ? "#9ca3af" : "rgb(75, 85, 99)" }}
          >
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium hover:underline"
              style={{
                color: theme === "dark" ? "#93c5fd" : "rgb(37, 99, 235)",
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
