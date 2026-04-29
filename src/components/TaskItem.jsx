import { useState } from "react";
import {
  formatDateTime,
  formatDisplayDateTime,
  toDateTimeInputValue,
} from "../services/taskServices";

function TaskItem({ task, deleteTask, updateTask, toggleComplete }) {
  const buildFormState = () => ({
    ...task,
    deadline: toDateTimeInputValue(task.deadline),
  });

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(buildFormState);

  const isOverdue =
    task.deadline &&
    new Date(task.deadline) < new Date() &&
    !task.completed;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (error) {
      setError("");
    }

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUpdate = async () => {
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    const updatedTask = {
      ...form,
      deadline: formatDateTime(form.deadline),
    };

    try {
      await updateTask(task.id, updatedTask);
      setEditing(false);
    } catch {
      setError("Unable to update task. Please try again.");
    }
  };

  return (
    <li
      className={`p-3 rounded border ${
        isOverdue ? "border-red-400 bg-red-50" : "bg-gray-50"
      }`}
    >
      {editing ? (
        <div className="space-y-2">
          {error && <p className="text-sm text-red-500">{error}</p>}

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="border p-1 w-full rounded"
          />

          <input
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            className="border p-1 w-full rounded"
          />

          <input
            type="datetime-local"
            name="deadline"
            value={form.deadline || ""}
            onChange={handleChange}
            className="border p-1 w-full rounded"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="completed"
              checked={form.completed}
              onChange={handleChange}
            />
            Completed
          </label>

          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-400 text-white px-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <p
              className={`font-semibold ${
                task.completed ? "line-through text-gray-400" : "text-gray-800"
              }`}
            >
              {task.title}
            </p>

            <p className="text-sm text-gray-500">
              {task.description || "No description"}
            </p>

            <p
              className={`text-xs ${
                isOverdue ? "text-red-500 font-semibold" : "text-gray-400"
              }`}
            >
              {formatDisplayDateTime(task.deadline)}
            </p>
          </div>

          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleComplete(task)}
            className="w-5 h-5"
          />

          <button
            onClick={() => {
              setForm(buildFormState());
              setError("");
              setEditing(true);
            }}
            className="text-blue-500"
          >
            Edit
          </button>

          <button
            onClick={() => deleteTask(task.id)}
            className="text-red-500"
          >
            X
          </button>
        </div>
      )}
    </li>
  );
}

export default TaskItem;
