import { useState } from "react";

function TaskForm({ addTask, closeForm }) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!task.title) return;
    addTask(task);
    closeForm();
  };

  return (
    <div className="bg-gray-100 p-4 rounded mb-4 space-y-3">
      <input name="title" placeholder="Title" onChange={handleChange} className="border p-2 w-full rounded" />
      <input name="description" placeholder="Description" onChange={handleChange} className="border p-2 w-full rounded" />
      <input type="datetime-local" name="deadline" onChange={handleChange} className="border p-2 w-full rounded" />

      <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded w-full">
        Save Task
      </button>
    </div>
  );
}

export default TaskForm;