import { useState } from "react";
import { parseNaturalLanguageTask } from "../services/taskServices";

export default function NaturalLanguageInput({ onTaskCreated }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await parseNaturalLanguageTask(text.trim());
      await onTaskCreated(response.data);
      setText("");
    } catch (err) {
      console.error(err);
      setError("Unable to create this task right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        Quick add
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Submit internship application tomorrow at 5 PM"
          disabled={loading}
          className="min-w-0 flex-1 rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          Add
        </button>
      </div>

      {loading && <p className="text-xs text-gray-500">Creating task...</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </form>
  );
}
