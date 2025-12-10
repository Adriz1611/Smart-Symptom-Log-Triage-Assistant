"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme/theme-context";
import { useAuth } from "@/lib/auth/auth-context";
import Button3D from "@/components/ui/Button3D";

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const { user, loading } = useAuth();

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{ background: theme === "dark" ? "#0a0b0f" : "#fffef9" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 transition-all duration-200"
        style={{
          background:
            theme === "dark"
              ? "linear-gradient(135deg, #1a1d29 0%, #252937 100%)"
              : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
          borderBottom:
            theme === "dark" ? "3px solid #2d3748" : "3px solid #242622",
          boxShadow: theme === "dark" ? "0 6px 0 #2d3748" : "0 6px 0 #242622",
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center transition-all hover:-translate-y-1"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(147, 197, 253) 0%, rgb(59, 130, 246) 100%)",
                  border: "3px solid #242622",
                  boxShadow: "0 4px 0 #242622",
                }}
              >
                <span
                  className="text-lg sm:text-xl lg:text-2xl font-black"
                  style={{ color: "white" }}
                >
                  +
                </span>
              </div>
              <h1
                className="text-base sm:text-lg md:text-xl lg:text-2xl font-black tracking-wider transition-colors duration-200"
                style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
              >
                <span className="hidden xs:inline">SYMPTOM TRACKER</span>
                <span className="xs:hidden">ST</span>
              </h1>
            </div>
            <div className="flex gap-2 sm:gap-3">
              {!loading && (
                <>
                  {user ? (
                    <Link href="/dashboard">
                      <Button3D variant="blue" size="sm">
                        <span className="hidden sm:inline font-black tracking-wide">
                          GO TO DASHBOARD
                        </span>
                        <span className="sm:hidden">DASHBOARD</span>
                      </Button3D>
                    </Link>
                  ) : (
                    <>
                      <Link href="/auth/login">
                        <Button3D variant="white" size="sm">
                          <span className="hidden sm:inline font-black tracking-wide">
                            SIGN IN
                          </span>
                          <span className="sm:hidden">→</span>
                        </Button3D>
                      </Link>
                      <Link href="/auth/register">
                        <Button3D variant="blue" size="sm">
                          <span className="hidden sm:inline font-black tracking-wide">
                            GET STARTED
                          </span>
                          <span className="sm:hidden">START</span>
                        </Button3D>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-16 md:py-20 lg:py-32">
        <div className="text-center">
          <div
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6 md:mb-8 tracking-widest transition-all hover:-translate-y-1"
            style={{
              background:
                "linear-gradient(135deg, rgb(219, 234, 254) 0%, rgb(191, 219, 254) 100%)",
              color: "rgb(30, 58, 138)",
              border: "3px solid #242622",
              boxShadow: "0 4px 0 #242622",
            }}
          >
            <span className="text-sm sm:text-base">🤖</span>
            <span className="hidden sm:inline">
              AI-POWERED HEALTH ASSISTANT
            </span>
            <span className="sm:hidden">AI ASSISTANT</span>
          </div>
          <div className="relative inline-block mb-2">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight tracking-widest relative px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 inline-block rounded-xl sm:rounded-2xl transition-all hover:-translate-y-2"
              style={{
                color: "#ffffff",
                background:
                  theme === "dark"
                    ? "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)"
                    : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                border: "4px solid #242622",
                boxShadow: "0 8px 0 #242622, 0 12px 20px rgba(0,0,0,0.3)",
                textShadow:
                  "3px 3px 0 #1e3a8a, 6px 6px 0 #1e40af, 9px 9px 0 rgba(0,0,0,0.5)",
                transform: "perspective(500px) rotateX(5deg)",
              }}
            >
              SMART SYMPTOM LOG &<br />
              <span
                className="inline-block mt-1 sm:mt-2"
                style={{
                  color: "#fbbf24",
                  textShadow:
                    "3px 3px 0 #f59e0b, 6px 6px 0 #d97706, 9px 9px 0 rgba(0,0,0,0.5)",
                }}
              >
                TRIAGE ASSISTANT
              </span>
            </h1>
          </div>
          <div className="mt-4 sm:mt-5 md:mt-6 mx-auto max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl px-2">
            <p
              className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed font-black tracking-wide px-4 sm:px-6 py-3 sm:py-4 rounded-xl inline-block transition-all hover:-translate-y-1"
              style={{
                color: theme === "dark" ? "#e5e7eb" : "#242622",
                background:
                  theme === "dark"
                    ? "linear-gradient(135deg, #1f2937 0%, #374151 100%)"
                    : "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
                border: "3px solid #242622",
                boxShadow: "0 4px 0 #242622",
                textShadow:
                  theme === "dark" ? "1px 1px 0 #0a0b0f" : "1px 1px 0 #ffffff",
              }}
            >
              Track your health symptoms intelligently, get AI-powered triage
              assessments, and make informed decisions about when to seek
              medical care.
            </p>
          </div>
          <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            {!loading && (
              <>
                {user ? (
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button3D variant="blue" size="lg" fullWidth>
                      <span className="flex items-center justify-center gap-2 font-black tracking-widest">
                        GO TO DASHBOARD
                        <span>→</span>
                      </span>
                    </Button3D>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/register" className="w-full sm:w-auto">
                      <Button3D variant="blue" size="lg" fullWidth>
                        <span className="flex items-center justify-center gap-2 font-black tracking-widest">
                          START TRACKING FREE
                          <span>→</span>
                        </span>
                      </Button3D>
                    </Link>
                    <Link href="/auth/login" className="w-full sm:w-auto">
                      <Button3D variant="white" size="lg" fullWidth>
                        <span className="font-black tracking-widest">
                          SIGN IN
                        </span>
                      </Button3D>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div
            className="rounded-xl transition-all hover:-translate-y-2 p-5 sm:p-6 md:p-8"
            style={{
              background:
                theme === "dark"
                  ? "linear-gradient(135deg, #1a1d29 0%, #252937 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
              border: "3px solid #242622",
              boxShadow: "0 6px 0 #242622",
            }}
          >
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-5"
              style={{
                background:
                  "linear-gradient(135deg, rgb(219, 234, 254) 0%, rgb(147, 197, 253) 100%)",
                border: "3px solid #242622",
                boxShadow: "0 3px 0 #242622",
              }}
            >
              <span className="text-2xl sm:text-3xl">📊</span>
            </div>
            <h3
              className="text-lg sm:text-xl font-black mb-2 sm:mb-3 tracking-wide"
              style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
            >
              SMART SYMPTOM LOGGING
            </h3>
            <p
              className="leading-relaxed text-sm sm:text-base font-bold"
              style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}
            >
              Track symptoms with detailed information including severity,
              location, and characteristics. Build a comprehensive health
              timeline.
            </p>
          </div>

          <div
            className="rounded-xl transition-all hover:-translate-y-2 p-5 sm:p-6 md:p-8"
            style={{
              background:
                theme === "dark"
                  ? "linear-gradient(135deg, #1a1d29 0%, #252937 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
              border: "3px solid #242622",
              boxShadow: "0 6px 0 #242622",
            }}
          >
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-5"
              style={{
                background:
                  "linear-gradient(135deg, rgb(187, 247, 208) 0%, rgb(134, 239, 172) 100%)",
                border: "3px solid #242622",
                boxShadow: "0 3px 0 #242622",
              }}
            >
              <span className="text-2xl sm:text-3xl">🏥</span>
            </div>
            <h3
              className="text-lg sm:text-xl font-black mb-2 sm:mb-3 tracking-wide"
              style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
            >
              INTELLIGENT TRIAGE
            </h3>
            <p
              className="leading-relaxed text-sm sm:text-base font-bold"
              style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}
            >
              Get instant urgency assessments with actionable recommendations on
              whether you need emergency care, urgent care, or self-care.
            </p>
          </div>

          <div
            className="rounded-xl transition-all hover:-translate-y-2 sm:col-span-2 lg:col-span-1 p-5 sm:p-6 md:p-8"
            style={{
              background:
                theme === "dark"
                  ? "linear-gradient(135deg, #1a1d29 0%, #252937 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
              border: "3px solid #242622",
              boxShadow: "0 6px 0 #242622",
            }}
          >
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-5"
              style={{
                background:
                  "linear-gradient(135deg, rgb(233, 213, 255) 0%, rgb(216, 180, 254) 100%)",
                border: "3px solid #242622",
                boxShadow: "0 3px 0 #242622",
              }}
            >
              <span className="text-2xl sm:text-3xl">🤖</span>
            </div>
            <h3
              className="text-lg sm:text-xl font-black mb-2 sm:mb-3 tracking-wide"
              style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
            >
              AI PATTERN RECOGNITION
            </h3>
            <p
              className="leading-relaxed text-sm sm:text-base font-bold"
              style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}
            >
              Advanced AI analyzes symptom patterns, identifies triggers, and
              generates comprehensive health insights for better care.
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-20 sm:mt-24 md:mt-32">
          <div className="text-center mb-12 sm:mb-16">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 tracking-wider"
              style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
            >
              HOW IT WORKS
            </h2>
            <p
              className="text-base sm:text-lg md:text-xl font-bold tracking-wide"
              style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}
            >
              SIMPLE, FAST, AND INTELLIGENT
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                step: "1",
                title: "LOG SYMPTOMS",
                desc: "Enter your symptoms with severity and details",
                icon: "📝",
                color: "rgb(59, 130, 246)",
                bgColor:
                  "linear-gradient(135deg, rgb(219, 234, 254) 0%, rgb(147, 197, 253) 100%)",
              },
              {
                step: "2",
                title: "AI ASSESSMENT",
                desc: "Receive instant triage evaluation",
                icon: "🤖",
                color: "rgb(139, 92, 246)",
                bgColor:
                  "linear-gradient(135deg, rgb(233, 213, 255) 0%, rgb(216, 180, 254) 100%)",
              },
              {
                step: "3",
                title: "FOLLOW GUIDANCE",
                desc: "Act on personalized recommendations",
                icon: "🎯",
                color: "rgb(34, 197, 94)",
                bgColor:
                  "linear-gradient(135deg, rgb(187, 247, 208) 0%, rgb(134, 239, 172) 100%)",
              },
              {
                step: "4",
                title: "TRACK PROGRESS",
                desc: "Monitor improvements over time",
                icon: "📈",
                color: "rgb(249, 115, 22)",
                bgColor:
                  "linear-gradient(135deg, rgb(254, 215, 170) 0%, rgb(253, 186, 116) 100%)",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative mb-6">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 text-white rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-black mx-auto transition-all hover:-translate-y-2"
                    style={{
                      background: item.color,
                      border: "3px solid #242622",
                      boxShadow: "0 6px 0 #242622",
                    }}
                  >
                    {item.step}
                  </div>
                  <div
                    className="absolute -top-2 -right-1/4 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all hover:-translate-y-1"
                    style={{
                      background: item.bgColor,
                      border: "3px solid #242622",
                      boxShadow: "0 3px 0 #242622",
                    }}
                  >
                    <span className="text-xl sm:text-2xl">{item.icon}</span>
                  </div>
                </div>
                <h3
                  className="font-black text-base sm:text-lg mb-2 tracking-wide"
                  style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm font-bold"
                  style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="mt-20 sm:mt-24 md:mt-32 rounded-2xl p-10 sm:p-12 md:p-16 text-center transition-all hover:-translate-y-1"
          style={{
            background:
              theme === "dark"
                ? "linear-gradient(135deg, rgb(30, 58, 138) 0%, rgb(29, 78, 216) 100%)"
                : "linear-gradient(135deg, rgb(147, 197, 253) 0%, rgb(59, 130, 246) 100%)",
            border: "3px solid #242622",
            boxShadow: "0 6px 0 #242622",
          }}
        >
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-wider uppercase">
              READY TO TAKE CONTROL?
            </h2>
            <p className="text-white/90 text-base sm:text-lg md:text-xl font-bold mb-8 max-w-2xl mx-auto tracking-wide">
              {user
                ? "Continue tracking your health and get AI-powered insights."
                : "Join thousands who trust our smart symptom tracking system to make better healthcare decisions."}
            </p>
            {!loading && (
              <Link
                href={user ? "/dashboard" : "/auth/register"}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all font-black tracking-widest uppercase hover:-translate-y-1"
                style={{
                  background: "#ffffff",
                  color: "#242622",
                  border: "3px solid #242622",
                  boxShadow: "0 4px 0 #242622",
                }}
              >
                {user ? "GO TO DASHBOARD" : "GET STARTED NOW - FREE"}
                <span className="text-xl">→</span>
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="mt-20 sm:mt-24 transition-all"
        style={{
          background:
            theme === "dark"
              ? "linear-gradient(135deg, rgb(31, 41, 55) 0%, rgb(17, 24, 39) 100%)"
              : "linear-gradient(135deg, rgb(243, 244, 246) 0%, rgb(229, 231, 235) 100%)",
          borderTop: "3px solid #242622",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 text-center">
          <p
            className="text-sm sm:text-base font-bold tracking-wide"
            style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}
          >
            © 2025 Smart Symptom Log & Triage Assistant. For informational
            purposes only. Not a substitute for professional medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
