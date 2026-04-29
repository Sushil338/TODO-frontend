import { useState } from "react";
import { formatDateTime } from "../services/taskServices";

function TaskForm({ addTask, closeForm }) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    if (error) {
      setError("");
    }

    setTask({
      ...task,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!task.title.trim()) {
      setError("Title is required");
      return;
    }

    const formattedTask = {
      ...task,
      deadline: formatDateTime(task.deadline),
      completed: false,
    };

    try {
      await addTask(formattedTask);
      closeForm();
    } catch {
      setError("Unable to save task. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded mb-4 space-y-3">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        name="title"
        value={task.title}
        onChange={handleChange}
        placeholder="Title"
        className="border p-2 w-full rounded"
      />

      <textarea
        name="description"
        value={task.description}
        onChange={handleChange}
        placeholder="Description"
        className="border p-2 w-full rounded"
      />

      <input
        type="datetime-local"
        name="deadline"
        value={task.deadline}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
        >
          Save Task
        </button>

        <button
          onClick={closeForm}
          className="bg-gray-400 text-white px-4 py-2 rounded w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default TaskForm;
