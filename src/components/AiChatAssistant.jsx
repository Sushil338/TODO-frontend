import { useState } from "react";
import { askAiQuestion } from "../services/taskServices";

export default function AiChatAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();

    const question = input.trim();
    if (!question || loading) {
      return;
    }

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const response = await askAiQuestion(question);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: response.data.answer },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "I could not read your tasks right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border-t border-gray-200 pt-4">
      <h2 className="mb-2 text-sm font-semibold text-gray-700">Ask tasks</h2>

      <div className="mb-2 h-44 overflow-y-auto rounded border border-gray-200 bg-gray-50 p-2">
        {messages.length === 0 && (
          <p className="text-sm text-gray-400">No messages yet.</p>
        )}

        <div className="space-y-2">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`whitespace-pre-line rounded px-3 py-2 text-sm ${
                message.role === "user"
                  ? "ml-8 bg-blue-600 text-white"
                  : "mr-8 bg-white text-gray-700"
              }`}
            >
              {message.text}
            </div>
          ))}

          {loading && (
            <p className="text-xs text-gray-500">Checking your tasks...</p>
          )}
        </div>
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What tasks are pending this week?"
          className="min-w-0 flex-1 rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          Send
        </button>
      </form>
    </section>
  );
}
