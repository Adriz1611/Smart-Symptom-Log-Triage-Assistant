"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme/theme-context";
import { useAuth } from "@/lib/auth/auth-context";
import Button3D from "@/components/ui/Button3D";

export default function HomePage() {
  const { theme } = useTheme();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const borderColor = theme === "dark" ? "#ffffff" : "#000000";
  const bgColor = theme === "dark" ? "#0a0b0f" : "#fffef9";
  const cardBg = theme === "dark" ? "#1a1d29" : "#ffffff";
  const textColor = theme === "dark" ? "#ffffff" : "#000000";

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: bgColor }}>
      {/* Neubrutalism Grid Background */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      
      {/* Header */}
      <header
        className="sticky top-0 z-50 nb-border-b"
        style={{
          background: cardBg,
          borderBottom: `4px solid ${borderColor}`,
          boxShadow: `0 4px 0 ${borderColor}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 animate-slide-in-left">
              <div
                className="w-12 h-12 flex items-center justify-center hover-lift cursor-pointer"
                style={{
                  background: "#ff6b9d",
                  border: `4px solid ${borderColor}`,
                  boxShadow: `4px 4px 0 ${borderColor}`,
                }}
              >
                <span className="text-2xl">🏥</span>
              </div>
              <h1
                className="text-xl font-black tracking-tight uppercase"
                style={{ color: textColor }}
              >
                Health<span className="text-[#0066ff]">Track</span>
              </h1>
            </div>
            <div className="flex gap-3 animate-slide-in-right">
              {!loading && (
                <>
                  {user ? (
                    <Link href="/dashboard">
                      <Button3D variant="blue" size="sm">
                        DASHBOARD
                      </Button3D>
                    </Link>
                  ) : (
                    <>
                      <Link href="/auth/login">
                        <Button3D variant="white" size="sm">
                          LOGIN
                        </Button3D>
                      </Link>
                      <Link href="/auth/register">
                        <Button3D variant="blue" size="sm">
                          START FREE
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 lg:py-32">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-6 py-3 nb-badge ${mounted ? 'animate-bounce-in' : 'opacity-0'}`}
              style={{
                background: "#ffed4e",
                color: "#000000",
                border: `4px solid ${borderColor}`,
                boxShadow: `4px 4px 0 ${borderColor}`,
              }}
            >
              <span className="animate-neon">🤖</span>
              <span className="font-black uppercase tracking-wide">AI-Powered Health Assistant</span>
            </div>

            {/* Main Headline */}
            <div className={`space-y-6 ${mounted ? 'animate-pop-in' : 'opacity-0'}`}>
              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight"
                style={{ color: textColor }}
              >
                TRACK YOUR
                <br />
                <span className="relative inline-block mt-4">
                  <span
                    className="relative z-10"
                    style={{
                      color: "#ffffff",
                      textShadow: `4px 4px 0 ${borderColor}`,
                    }}
                  >
                    HEALTH
                  </span>
                  <span
                    className="absolute inset-0 -z-10 rotate-slight"
                    style={{
                      background: "#0066ff",
                      border: `4px solid ${borderColor}`,
                      boxShadow: `8px 8px 0 ${borderColor}`,
                      transform: "translate(0, 0)",
                    }}
                  />
                </span>
                <br />
                LIKE A PRO
              </h1>
              
              <p
                className="text-xl md:text-2xl font-bold max-w-3xl mx-auto px-8 py-6 rotate-slight-right"
                style={{
                  background: "#39ff14",
                  color: "#000000",
                  border: `4px solid ${borderColor}`,
                  boxShadow: `6px 6px 0 ${borderColor}`,
                }}
              >
                Get AI-powered triage assessments instantly. Know when to seek care. Track symptoms intelligently.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center ${mounted ? 'animate-slide-up animate-stagger-3' : 'opacity-0'}`}>
              {!loading && !user && (
                <>
                  <Link href="/auth/register">
                    <Button3D variant="blue" size="lg">
                      <span className="flex items-center gap-2">
                        START FREE NOW
                        <span className="text-2xl">→</span>
                      </span>
                    </Button3D>
                  </Link>
                  <Link href="/auth/login">
                    <Button3D variant="yellow" size="lg">
                      SIGN IN
                    </Button3D>
                  </Link>
                </>
              )}
              {user && (
                <Link href="/dashboard">
                  <Button3D variant="blue" size="lg">
                    <span className="flex items-center gap-2">
                      GO TO DASHBOARD
                      <span className="text-2xl">→</span>
                    </span>
                  </Button3D>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-20 space-y-12">
          <h2
            className="text-4xl md:text-5xl font-black text-center uppercase tracking-tight"
            style={{ color: textColor }}
          >
            Why You'll <span className="text-[#ff6b9d]">Love</span> It
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div
              className={`nb-card p-8 space-y-4 hover-grow ${mounted ? 'animate-slide-up animate-stagger-1' : 'opacity-0'}`}
              style={{
                background: cardBg,
                border: `4px solid ${borderColor}`,
                boxShadow: `6px 6px 0 ${borderColor}`,
              }}
            >
              <div
                className="w-16 h-16 flex items-center justify-center rotate-slight"
                style={{
                  background: "#0066ff",
                  border: `4px solid ${borderColor}`,
                  boxShadow: `4px 4px 0 ${borderColor}`,
                }}
              >
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-2xl font-black uppercase" style={{ color: textColor }}>
                Smart Logging
              </h3>
              <p className="text-lg font-bold" style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}>
                Track symptoms with detailed info: severity, location, vitals. Build your health timeline.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className={`nb-card p-8 space-y-4 hover-grow ${mounted ? 'animate-slide-up animate-stagger-2' : 'opacity-0'}`}
              style={{
                background: cardBg,
                border: `4px solid ${borderColor}`,
                boxShadow: `6px 6px 0 ${borderColor}`,
              }}
            >
              <div
                className="w-16 h-16 flex items-center justify-center rotate-slight-right"
                style={{
                  background: "#ff6b9d",
                  border: `4px solid ${borderColor}`,
                  boxShadow: `4px 4px 0 ${borderColor}`,
                }}
              >
                <span className="text-4xl">🚨</span>
              </div>
              <h3 className="text-2xl font-black uppercase" style={{ color: textColor }}>
                Instant Triage
              </h3>
              <p className="text-lg font-bold" style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}>
                Get immediate urgency assessments. Know if you need ER, urgent care, or home rest.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className={`nb-card p-8 space-y-4 hover-grow ${mounted ? 'animate-slide-up animate-stagger-3' : 'opacity-0'}`}
              style={{
                background: cardBg,
                border: `4px solid ${borderColor}`,
                boxShadow: `6px 6px 0 ${borderColor}`,
              }}
            >
              <div
                className="w-16 h-16 flex items-center justify-center"
                style={{
                  background: "#39ff14",
                  border: `4px solid ${borderColor}`,
                  boxShadow: `4px 4px 0 ${borderColor}`,
                }}
              >
                <span className="text-4xl">🤖</span>
              </div>
              <h3 className="text-2xl font-black uppercase" style={{ color: textColor }}>
                AI Insights
              </h3>
              <p className="text-lg font-bold" style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}>
                Powered by Google Gemini. Get pattern analysis and personalized health recommendations.
              </p>
            </div>

            {/* Feature 4 */}
            <div
              className={`nb-card p-8 space-y-4 hover-grow ${mounted ? 'animate-slide-up animate-stagger-1' : 'opacity-0'}`}
              style={{
                background: cardBg,
                border: `4px solid ${borderColor}`,
                boxShadow: `6px 6px 0 ${borderColor}`,
              }}
            >
              <div
                className="w-16 h-16 flex items-center justify-center rotate-slight"
                style={{
                  background: "#ffed4e",
                  border: `4px solid ${borderColor}`,
                  boxShadow: `4px 4px 0 ${borderColor}`,
                }}
              >
                <span className="text-4xl">💊</span>
              </div>
              <h3 className="text-2xl font-black uppercase" style={{ color: textColor }}>
                Med Tracking
              </h3>
              <p className="text-lg font-bold" style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}>
                Never miss a dose. Track adherence, effectiveness, and side effects all in one place.
              </p>
            </div>

            {/* Feature 5 */}
            <div
              className={`nb-card p-8 space-y-4 hover-grow ${mounted ? 'animate-slide-up animate-stagger-2' : 'opacity-0'}`}
              style={{
                background: cardBg,
                border: `4px solid ${borderColor}`,
                boxShadow: `6px 6px 0 ${borderColor}`,
              }}
            >
              <div
                className="w-16 h-16 flex items-center justify-center rotate-slight-right"
                style={{
                  background: "#c724b1",
                  border: `4px solid ${borderColor}`,
                  boxShadow: `4px 4px 0 ${borderColor}`,
                }}
              >
                <span className="text-4xl">📈</span>
              </div>
              <h3 className="text-2xl font-black uppercase" style={{ color: textColor }}>
                Visual Analytics
              </h3>
              <p className="text-lg font-bold" style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}>
                Beautiful charts and graphs. See patterns, trends, and correlations at a glance.
              </p>
            </div>

            {/* Feature 6 */}
            <div
              className={`nb-card p-8 space-y-4 hover-grow ${mounted ? 'animate-slide-up animate-stagger-3' : 'opacity-0'}`}
              style={{
                background: cardBg,
                border: `4px solid ${borderColor}`,
                boxShadow: `6px 6px 0 ${borderColor}`,
              }}
            >
              <div
                className="w-16 h-16 flex items-center justify-center"
                style={{
                  background: "#ff6b35",
                  border: `4px solid ${borderColor}`,
                  boxShadow: `4px 4px 0 ${borderColor}`,
                }}
              >
                <span className="text-4xl">🔒</span>
              </div>
              <h3 className="text-2xl font-black uppercase" style={{ color: textColor }}>
                Secure & Private
              </h3>
              <p className="text-lg font-bold" style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}>
                Bank-level encryption. Your health data stays yours. GDPR compliant.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div
          className="my-20 p-12 md:p-20 text-center space-y-8 rotate-slight"
          style={{
            background: "#0066ff",
            border: `4px solid ${borderColor}`,
            boxShadow: `10px 10px 0 ${borderColor}`,
          }}
        >
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase">
            Ready to Take Control?
          </h2>
          <p className="text-xl md:text-2xl font-bold text-white max-w-2xl mx-auto">
            Join thousands tracking their health smarter. Free forever.
          </p>
          {!loading && !user && (
            <Link href="/auth/register">
              <Button3D variant="yellow" size="lg">
                <span className="flex items-center gap-3">
                  GET STARTED NOW
                  <span className="text-3xl animate-float">🚀</span>
                </span>
              </Button3D>
            </Link>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="mt-20 py-12"
        style={{
          background: cardBg,
          borderTop: `4px solid ${borderColor}`,
          boxShadow: `0 -4px 0 ${borderColor}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg font-black uppercase" style={{ color: textColor }}>
            Made with <span className="text-[#ff0000] animate-neon">❤️</span> for Better Healthcare
          </p>
          <p className="mt-4 font-bold" style={{ color: theme === "dark" ? "#9ca3af" : "#525252" }}>
            © 2025 HealthTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
