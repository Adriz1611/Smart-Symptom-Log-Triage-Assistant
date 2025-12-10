"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/lib/auth/auth-context";
import { useTheme } from "@/lib/theme/theme-context";
import Button3D from "@/components/ui/Button3D";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{ background: theme === "dark" ? "#0a0b0f" : "#fffef9" }}
    >
      {/* Navigation */}
      <nav
        className="sticky top-0 z-50 transition-colors duration-200"
        style={{
          background: theme === "dark" ? "#1a1d29" : "#ffffff",
          borderBottom:
            theme === "dark" ? "4px solid #2d3748" : "4px solid #242622",
          boxShadow: theme === "dark" ? "0 4px 0 #2d3748" : "0 4px 0 #242622",
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">
            {/* Logo and Brand */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <div
                className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-transform hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(147, 197, 253) 0%, rgb(96, 165, 250) 100%)",
                  border: "3px solid #242622",
                  boxShadow: "4px 4px 0px #242622",
                }}
              >
                <span
                  className="text-xl sm:text-2xl md:text-3xl font-bold"
                  style={{ color: "rgb(30, 58, 138)" }}
                >
                  +
                </span>
              </div>
              <div className="hidden xs:flex flex-col">
                <span
                  className="text-base sm:text-lg md:text-xl font-bold leading-tight transition-colors duration-200"
                  style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
                >
                  Symptom Tracker
                </span>
                <span
                  className="text-[10px] sm:text-xs font-medium transition-colors duration-200"
                  style={{ color: theme === "dark" ? "#6b7280" : "#6b7280" }}
                >
                  Health Dashboard
                </span>
              </div>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* User Info Card - Desktop */}
              <div
                className="hidden sm:flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-xl transition-all duration-200 hover:scale-105"
                style={{
                  background:
                    theme === "dark" ? "#2d3748" : "rgb(243, 244, 246)",
                  border: "2px solid #242622",
                  boxShadow: "3px 3px 0px #242622",
                }}
              >
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, rgb(147, 197, 253) 0%, rgb(96, 165, 250) 100%)",
                    border: "2px solid #242622",
                  }}
                >
                  <span
                    className="text-sm sm:text-base font-bold"
                    style={{ color: "rgb(30, 58, 138)" }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:flex flex-col">
                  <span
                    className="font-bold text-sm leading-tight transition-colors duration-200"
                    style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
                  >
                    {user.name}
                  </span>
                  <span
                    className="text-[10px] font-medium transition-colors duration-200"
                    style={{ color: theme === "dark" ? "#6b7280" : "#6b7280" }}
                  >
                    {user.email}
                  </span>
                </div>
              </div>

              {/* Mobile Avatar */}
              <div
                className="sm:hidden w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(147, 197, 253) 0%, rgb(96, 165, 250) 100%)",
                  border: "2px solid #242622",
                  boxShadow: "2px 2px 0px #242622",
                }}
              >
                <span
                  className="text-sm font-bold"
                  style={{ color: "rgb(30, 58, 138)" }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Logout Button */}
              <Button3D variant="red" size="sm" onClick={logout}>
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <span className="hidden sm:inline text-sm md:text-base">
                    Logout
                  </span>
                  <span className="sm:hidden text-base">✕</span>
                  <span className="hidden sm:inline text-base">👋</span>
                </span>
              </Button3D>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
}
