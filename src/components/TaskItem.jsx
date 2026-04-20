import { useState } from "react";

function TaskItem({ task, deleteTask, updateTask, toggleComplete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...task });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleUpdate = () => {
    updateTask(task.id, form);
    setEditing(false);
  };

  return (
    <li className="bg-gray-50 p-3 rounded">
      {editing ? (
        <div className="space-y-2">
          <input name="title" value={form.title} onChange={handleChange} className="border p-1 w-full rounded" />
          <input name="description" value={form.description} onChange={handleChange} className="border p-1 w-full rounded" />
          <input type="datetime-local" name="deadline" value={form.deadline || ""} onChange={handleChange} className="border p-1 w-full rounded" />

          <label>
            <input type="checkbox" name="completed" checked={form.completed} onChange={handleChange} /> Completed
          </label>

          <div className="flex gap-2">
            <button onClick={handleUpdate} className="bg-green-500 text-white px-2 rounded">Save</button>
            <button onClick={() => setEditing(false)} className="bg-gray-400 text-white px-2 rounded">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <p className={`font-semibold ${task.completed ? "line-through text-gray-400" : ""}`}>
              {task.title}
            </p>
            <p className="text-sm text-gray-500">{task.description}</p>
            <p className="text-xs text-gray-400">
              {task.deadline ? new Date(task.deadline).toLocaleString() : "No deadline"}
            </p>
          </div>

          <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task)} />

          <button onClick={() => setEditing(true)} className="text-blue-500">Edit</button>
          <button onClick={() => deleteTask(task.id)} className="text-red-500">✕</button>
        </div>
      )}
    </li>
  );
}

export default TaskItem;