"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { useTheme } from "@/lib/theme/theme-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button3D from "@/components/ui/Button3D";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-3 sm:px-4 transition-colors duration-200"
      style={{ background: theme === "dark" ? "#0a0b0f" : "#fffef9" }}
    >
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
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
            className="text-2xl sm:text-3xl md:text-4xl font-bold transition-colors duration-200"
            style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
          >
            Welcome Back
          </h1>
          <p
            className="mt-1.5 sm:mt-2 text-sm sm:text-base md:text-lg font-medium transition-colors duration-200"
            style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}
          >
            Sign in to continue your health journey
          </p>
        </div>

        {/* Login Card */}
        <div
          className="rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 transition-colors duration-200"
          style={{
            background: theme === "dark" ? "#1a1d29" : "white",
            border:
              theme === "dark" ? "2px solid #2d3748" : "2px solid #242622",
            boxShadow:
              theme === "dark" ? "4px 4px 0px #2d3748" : "4px 4px 0px #242622",
          }}
        >
          {error && (
            <div
              className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3"
              style={{
                background: "rgb(254, 226, 226)",
                border: "2px solid rgb(220, 38, 38)",
                color: "rgb(127, 29, 29)",
              }}
            >
              <span className="text-lg sm:text-xl">⚠️</span>
              <div className="flex-1">
                <p className="font-bold text-sm sm:text-base">Error</p>
                <p className="text-xs sm:text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-bold mb-1.5 sm:mb-2 transition-colors duration-200"
                style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 font-medium text-sm sm:text-base"
                style={{
                  border:
                    theme === "dark"
                      ? "2px solid #2d3748"
                      : "2px solid #242622",
                  background: theme === "dark" ? "#0a0b0f" : "white",
                  color: theme === "dark" ? "#e5e7eb" : "#242622",
                }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-bold mb-1.5 sm:mb-2 transition-colors duration-200"
                style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 font-medium text-sm sm:text-base"
                style={{
                  border:
                    theme === "dark"
                      ? "2px solid #2d3748"
                      : "2px solid #242622",
                  background: theme === "dark" ? "#0a0b0f" : "white",
                  color: theme === "dark" ? "#e5e7eb" : "#242622",
                }}
                placeholder="••••••••"
              />
            </div>

            <Button3D
              type="submit"
              variant="blue"
              size="lg"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-current border-t-transparent"></div>
                  <span className="text-sm sm:text-base">Signing in...</span>
                </span>
              ) : (
                <span className="text-sm sm:text-base">Sign In</span>
              )}
            </Button3D>
          </form>

          <div className="mt-6 sm:mt-8 text-center">
            <p
              className="font-medium text-sm sm:text-base transition-colors duration-200"
              style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}
            >
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="font-bold hover:underline"
                style={{
                  color: theme === "dark" ? "#93c5fd" : "rgb(59, 130, 246)",
                }}
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            🔒 Your health data is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
