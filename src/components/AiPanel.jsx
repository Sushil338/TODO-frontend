import { useCallback, useEffect, useState } from "react";
import {
  formatDisplayDateTime,
  getPrioritizedTasks,
  getProductivityInsights,
} from "../services/taskServices";
import AiChatAssistant from "./AiChatAssistant";
import NaturalLanguageInput from "./NaturalLanguageInput";

function AiPanel({ onTaskCreated, refreshKey }) {
  const [priorityTasks, setPriorityTasks] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAiData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [priorityResponse, insightResponse] = await Promise.all([
        getPrioritizedTasks(),
        getProductivityInsights(),
      ]);

      setPriorityTasks(priorityResponse.data);
      setInsights(insightResponse.data);
    } catch (err) {
      console.error(err);
      setError("AI data is unavailable right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAiData();
  }, [loadAiData, refreshKey]);

  return (
    <aside className="w-full rounded-xl bg-white p-5 shadow-md">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">AI Assistant</h2>
      </div>

      <div className="space-y-4">
        <NaturalLanguageInput
          onTaskCreated={async (task) => {
            await onTaskCreated(task);
            await loadAiData();
          }}
        />

        <section className="border-t border-gray-200 pt-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">Priority</h2>
            <button
              type="button"
              onClick={loadAiData}
              disabled={loading}
              className="text-xs font-medium text-blue-600 disabled:opacity-60"
            >
              Refresh
            </button>
          </div>

          {error && <p className="mb-2 text-xs text-red-500">{error}</p>}

          <div className="space-y-2">
            {priorityTasks.length === 0 && !loading && (
              <p className="text-sm text-gray-400">No pending tasks.</p>
            )}

            {priorityTasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className="border-b border-gray-100 pb-2 last:border-b-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900">
                    {task.title}
                  </p>
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                    {task.priorityScore}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {formatDisplayDateTime(task.deadline)}
                </p>
                <p className="text-xs text-gray-400">{task.priorityReason}</p>
              </div>
            ))}

            {loading && <p className="text-xs text-gray-500">Loading...</p>}
          </div>
        </section>

        <section className="border-t border-gray-200 pt-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-700">
            Productivity
          </h2>

          <ul className="space-y-2">
            {insights.map((insight, index) => (
              <li key={index} className="text-sm text-gray-600">
                {insight}
              </li>
            ))}
          </ul>
        </section>

        <AiChatAssistant />
      </div>
    </aside>
  );
}

export default AiPanel;
