import React from "react";

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 text-white font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto border-b border-gray-700/50">
        <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          TaskFlow AI
        </div>
        <button
          onClick={onGetStarted}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-600/20"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto text-center px-4 pt-20 pb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Manage Tasks Smarter with{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AI Assistance
          </span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          The ultimate dockerized workspace designed to streamline your productivity. Organize your pipeline, track status dynamically, and leverage integrated AI assistance to keep workflows flowing.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white hover:bg-blue-500 transition transform hover:-translate-y-0.5 shadow-xl shadow-blue-600/30"
          >
            Get Started Free
          </button>
          <a
            href="#features"
            className="w-full sm:w-auto rounded-xl bg-gray-800/80 border border-gray-700 px-8 py-4 text-base font-semibold text-gray-300 hover:bg-gray-700 transition"
          >
            Learn More
          </a>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16 border-t border-gray-800">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Built for Seamless Productivity</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700/60 hover:border-gray-600 transition">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 font-bold mb-4">🚀</div>
            <h3 className="text-lg font-semibold mb-2">Optimized Flow</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Filter, search, and update task cycles cleanly with minimal clicks.</p>
          </div>
          {/* Card 2 */}
          <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700/60 hover:border-gray-600 transition">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 font-bold mb-4">🤖</div>
            <h3 className="text-lg font-semibold mb-2">AI Copilot Panel</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Leverage intelligent prompts right beside your task board to structure your goals seamlessly.</p>
          </div>
          {/* Card 3 */}
          <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700/60 hover:border-gray-600 transition">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 font-bold mb-4">🔒</div>
            <h3 className="text-lg font-semibold mb-2">Secure Isolation</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Dockerized backend, custom network layers, and safe data persistence via Redis and MySQL.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-500 border-t border-gray-800/60 mt-12">
        &copy; {new Date().getFullYear()} TaskFlow AI. All rights reserved.
      </footer>
    </div>
  );
}