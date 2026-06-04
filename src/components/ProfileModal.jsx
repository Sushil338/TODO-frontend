import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProfileModal({ open, onClose }) {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user) {
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        newPassword: "",
      });
      setError("");
      setSuccess("");
    }
  }, [open, user]);

  if (!open) {
    return null;
  }

  const handleChange = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
      };

      if (form.newPassword.trim()) {
        payload.newPassword = form.newPassword;
      }

      await updateProfile(payload);
      setSuccess("Profile updated successfully.");
      setForm((current) => ({ ...current, newPassword: "" }));
    } catch (err) {
      const message =
        err.response?.data?.message || "Unable to update profile right now.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Update profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full name"
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />

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
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="New password (optional)"
            minLength={6}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
