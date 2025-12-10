import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">+</span>
              </div>
              <h1 className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Symptom Tracker
              </h1>
            </div>
            <div className="flex gap-3">
              <Link
                href="/auth/login"
                className="px-5 py-2.5 text-blue-600 hover:text-blue-700 font-semibold hover:bg-blue-50 rounded-xl transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-semibold text-sm mb-6">
            <span className="text-lg">🤖</span>
            AI-Powered Health Assistant
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
            Smart Symptom Log &<br />
            <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Triage Assistant
            </span>
          </h1>
          <p className="mt-6 text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Track your health symptoms intelligently, get AI-powered triage
            assessments, and make informed decisions about when to seek medical
            care.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="group px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white text-lg rounded-2xl hover:from-blue-700 hover:to-indigo-700 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">
                Start Tracking Free
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </span>
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-white text-blue-600 text-lg rounded-2xl hover:bg-gray-50 font-bold border-2 border-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:scale-105">
            <div className="w-14 h-14 bg-linear-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Smart Symptom Logging
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Track symptoms with detailed information including severity,
              location, and characteristics. Build a comprehensive health
              timeline.
            </p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:scale-105">
            <div className="w-14 h-14 bg-linear-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <span className="text-3xl">🏥</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Intelligent Triage
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Get instant urgency assessments with actionable recommendations on
              whether you need emergency care, urgent care, or self-care.
            </p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:scale-105">
            <div className="w-14 h-14 bg-linear-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              AI Pattern Recognition
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Advanced AI analyzes symptom patterns, identifies triggers, and
              generates comprehensive health insights for better care.
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
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
              <div key={item.step} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto shadow-xl group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-blue-100">
                    <span className="text-xl">{item.icon}</span>
                  </div>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-32 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 sm:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-blue-100 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust our smart symptom tracking
              system to make better healthcare decisions.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 text-lg rounded-2xl hover:bg-gray-50 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Get Started Now - It's Free
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50/80 backdrop-blur-sm border-t border-gray-200 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-gray-600">
            © 2025 Smart Symptom Log & Triage Assistant. For informational
            purposes only. Not a substitute for professional medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
