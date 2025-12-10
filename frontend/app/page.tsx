"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme/theme-context";
import Button3D from "@/components/ui/Button3D";

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{ background: theme === "dark" ? "#0a0b0f" : "#fffef9" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 transition-colors duration-200"
        style={{
          background: theme === "dark" ? "#1a1d29" : "#ffffff",
          borderBottom:
            theme === "dark" ? "3px solid #2d3748" : "3px solid #242622",
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl flex items-center justify-center"
                style={{
                  background: "rgb(147, 197, 253)",
                  border: "2px solid #242622",
                }}
              >
                <span
                  className="text-lg sm:text-xl lg:text-2xl font-bold"
                  style={{ color: "rgb(30, 58, 138)" }}
                >
                  +
                </span>
              </div>
              <h1
                className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold transition-colors duration-200"
                style={{ color: theme === "dark" ? "#e5e7eb" : "#242622" }}
              >
                <span className="hidden xs:inline">Symptom Tracker</span>
                <span className="xs:hidden">ST</span>
              </h1>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Link href="/auth/login">
                <Button3D variant="white" size="sm">
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">→</span>
                </Button3D>
              </Link>
              <Link href="/auth/register">
                <Button3D variant="blue" size="sm">
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                </Button3D>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-16 md:py-20 lg:py-32">
        <div className="text-center">
          <div
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6 md:mb-8"
            style={{
              background: "rgb(219, 234, 254)",
              color: "rgb(30, 58, 138)",
              border: "2px solid #242622",
            }}
          >
            <span className="text-sm sm:text-base">🤖</span>
            <span className="hidden sm:inline">
              AI-Powered Health Assistant
            </span>
            <span className="sm:hidden">AI Health Assistant</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight"
            style={{ color: "#242622" }}
          >
            Smart Symptom Log &<br />
            <span style={{ color: "rgb(59, 130, 246)" }}>Triage Assistant</span>
          </h1>
          <p
            className="mt-4 sm:mt-5 md:mt-6 text-sm sm:text-base md:text-lg lg:text-xl max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto leading-relaxed px-2"
            style={{ color: "#525252", fontWeight: 500 }}
          >
            Track your health symptoms intelligently, get AI-powered triage
            assessments, and make informed decisions about when to seek medical
            care.
          </p>
          <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button3D variant="blue" size="lg" fullWidth>
                <span className="flex items-center justify-center gap-2">
                  Start Tracking Free
                  <span>→</span>
                </span>
              </Button3D>
            </Link>
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button3D variant="white" size="lg" fullWidth>
                Sign In
              </Button3D>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div
            className="bg-white p-5 sm:p-6 md:p-8 rounded-xl transition-all hover:-translate-y-1"
            style={{
              border: "3px solid #242622",
              boxShadow: "4px 4px 0px #242622",
            }}
          >
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-5"
              style={{
                background: "rgb(219, 234, 254)",
                border: "2px solid #242622",
              }}
            >
              <span className="text-2xl sm:text-3xl">📊</span>
            </div>
            <h3
              className="text-lg sm:text-xl font-bold mb-2 sm:mb-3"
              style={{ color: "#242622" }}
            >
              Smart Symptom Logging
            </h3>
            <p
              className="leading-relaxed text-sm sm:text-base"
              style={{ color: "#525252", fontWeight: 500 }}
            >
              Track symptoms with detailed information including severity,
              location, and characteristics. Build a comprehensive health
              timeline.
            </p>
          </div>

          <div
            className="bg-white p-5 sm:p-6 md:p-8 rounded-xl transition-all hover:-translate-y-1"
            style={{
              border: "3px solid #242622",
              boxShadow: "4px 4px 0px #242622",
            }}
          >
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-5"
              style={{
                background: "rgb(187, 247, 208)",
                border: "2px solid #242622",
              }}
            >
              <span className="text-2xl sm:text-3xl">🏥</span>
            </div>
            <h3
              className="text-lg sm:text-xl font-bold mb-2 sm:mb-3"
              style={{ color: "#242622" }}
            >
              Intelligent Triage
            </h3>
            <p
              className="leading-relaxed text-sm sm:text-base"
              style={{ color: "#525252", fontWeight: 500 }}
            >
              Get instant urgency assessments with actionable recommendations on
              whether you need emergency care, urgent care, or self-care.
            </p>
          </div>

          <div
            className="bg-white p-5 sm:p-6 md:p-8 rounded-xl transition-all hover:-translate-y-1 sm:col-span-2 lg:col-span-1"
            style={{
              border: "3px solid #242622",
              boxShadow: "4px 4px 0px #242622",
            }}
          >
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-5"
              style={{
                background: "rgb(233, 213, 255)",
                border: "2px solid #242622",
              }}
            >
              <span className="text-2xl sm:text-3xl">🤖</span>
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: "#242622" }}>
              AI Pattern Recognition
            </h3>
            <p
              className="leading-relaxed"
              style={{ color: "#525252", fontWeight: 500 }}
            >
              Advanced AI analyzes symptom patterns, identifies triggers, and
              generates comprehensive health insights for better care.
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold mb-3"
              style={{ color: "#242622" }}
            >
              How It Works
            </h2>
            <p
              className="text-lg"
              style={{ color: "#525252", fontWeight: 500 }}
            >
              Simple, fast, and intelligent
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Log Symptoms",
                desc: "Enter your symptoms with severity and details",
                icon: "📝",
              },
              {
                step: "2",
                title: "AI Assessment",
                desc: "Receive instant triage evaluation",
                icon: "🤖",
              },
              {
                step: "3",
                title: "Follow Guidance",
                desc: "Act on personalized recommendations",
                icon: "🎯",
              },
              {
                step: "4",
                title: "Track Progress",
                desc: "Monitor improvements over time",
                icon: "📈",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-lg flex items-center justify-center text-2xl font-bold mx-auto">
                    {item.step}
                  </div>
                  <div className="absolute -top-2 -right-1/4 w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                    <span className="text-xl">{item.icon}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-32 bg-blue-600 rounded-lg p-12 sm:p-16 text-center">
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-blue-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust our smart symptom tracking
              system to make better healthcare decisions.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 text-base font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Get Started Now - It's Free
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 Smart Symptom Log & Triage Assistant. For informational
            purposes only. Not a substitute for professional medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
