import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login({
          email: form.email,
          password: form.password,
        });
      } else {
        await register({
          username: form.username,
          email: form.email,
          password: form.password,
        });
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Unable to sign in. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const tabClass = (value) =>
    `flex-1 rounded px-3 py-2 text-sm font-medium ${
      mode === value ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-md">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Task Manager</h1>
        <p className="mb-6 text-sm text-gray-500">
          Sign in with JWT to manage your personal tasks.
        </p>

        <div className="mb-4 flex gap-2">
          <button type="button" onClick={() => setMode("login")} className={tabClass("login")}>
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={tabClass("register")}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "register" && (
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          )}

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            minLength={6}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
