import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { login, register, verifyOtp, sendForgotPasswordOtp, submitPasswordReset } = useAuth();
  const [mode, setMode] = useState("login"); // "login", "register", or "forgot"
  const [isVerifying, setIsVerifying] = useState(false); // Tracks if we are showing an OTP submission screen
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else if (mode === "register") {
        const data = await register({ username: form.username, email: form.email, password: form.password });
        setSuccessMessage(data.message || "OTP sent to your email!");
        setIsVerifying(true);
      } else if (mode === "forgot") {
        const msg = await sendForgotPasswordOtp(form.email);
        setSuccessMessage(typeof msg === "string" ? msg : "Reset OTP sent to your email!");
        setIsVerifying(true);
      }
    } catch (err) {
      const message = err.response?.data || err.response?.data?.message || "Action failed. Please try again.";
      setError(typeof message === "string" ? message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        await verifyOtp(form.email, otp);
      } else if (mode === "forgot") {
        const msg = await submitPasswordReset(form.email, otp, form.newPassword);
        setSuccessMessage(typeof msg === "string" ? msg : "Password updated successfully!");
        // Reset state and bring them back to login screen smoothly
        setTimeout(() => {
          setMode("login");
          setIsVerifying(false);
          setOtp("");
          setForm({ username: "", email: "", password: "", newPassword: "" });
          setSuccessMessage("");
        }, 3000);
      }
    } catch (err) {
      const message = err.response?.data || err.response?.data?.message || "Verification failed.";
      setError(typeof message === "string" ? message : "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetState = (targetMode) => {
    setMode(targetMode);
    setIsVerifying(false);
    setError("");
    setSuccessMessage("");
    setOtp("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-md border border-gray-100">
        
        {/* Tab Toggle - Hidden when verifying an OTP */}
        {!isVerifying && (
          <div className="mb-6 flex gap-2 rounded bg-gray-100 p-1">
            <button
              type="button"
              className={`flex-1 rounded px-3 py-2 text-sm font-medium ${mode === "login" || mode === "forgot" ? "bg-gray-900 text-white" : "text-gray-700"}`}
              onClick={() => resetState("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={`flex-1 rounded px-3 py-2 text-sm font-medium ${mode === "register" ? "bg-gray-900 text-white" : "text-gray-700"}`}
              onClick={() => resetState("register")}
            >
              Register
            </button>
          </div>
        )}

        {/* Form State 1: Input Fields Collection */}
        {!isVerifying ? (
          <form onSubmit={handleAuthSubmit} className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-1">
              {mode === "login" ? "Welcome Back" : mode === "register" ? "Create Account" : "Reset Password"}
            </h2>
            <p className="text-xs text-gray-500 text-center mb-4">
              {mode === "forgot" ? "Enter your email to receive a recovery code." : "Sign in to manage your tasks."}
            </p>

            {mode === "register" && (
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
              />
            )}

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email address"
              required
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
            />

            {mode !== "forgot" && (
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                minLength={6}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
              />
            )}

            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {loading ? "Please wait..." : mode === "login" ? "Login" : mode === "register" ? "Send Registration Code" : "Send Recovery Code"}
            </button>

            {mode === "login" && (
              <button
                type="button"
                onClick={() => resetState("forgot")}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-800 underline block mt-2"
              >
                Forgot Password?
              </button>
            )}
          </form>
        ) : (
          /* Form State 2: OTP Verification Display Layout */
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">Verify Code</h2>
              <p className="text-xs text-gray-500 mt-1">
                A 6-digit security code was sent to <br />
                <span className="font-medium text-gray-800">{form.email}</span>
              </p>
            </div>

            {successMessage && (
              <p className="text-xs text-green-600 bg-green-50 border border-green-200 rounded p-2 text-center">
                {successMessage}
              </p>
            )}

            {mode === "forgot" && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Enter New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">6-Digit Verification Code</label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 text-center text-lg font-mono tracking-widest focus:outline-none focus:border-gray-900"
              />
            </div>

            {error && <p className="text-sm text-red-500 font-medium text-center">{error}</p>}

            <div className="space-y-2">
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60 transition-colors"
              >
                {loading ? "Processing..." : mode === "register" ? "Verify & Create Account" : "Reset My Password"}
              </button>

              <button
                type="button"
                onClick={() => resetState(mode)}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-800 underline block pt-1"
              >
                ← Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}