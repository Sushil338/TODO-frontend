import { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const API_URL = "http://localhost:8080/api/tasks";

  const fetchTasks = async () => {
    const res = await axios.get(API_URL);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (task) => {
    await axios.post(API_URL, {
      ...task,
      completed: false,
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTasks();
  };

  const updateTask = async (id, updatedTask) => {
    await axios.put(`${API_URL}/${id}`, updatedTask);
    fetchTasks();
  };

  const toggleComplete = async (task) => {
    await axios.put(`${API_URL}/${task.id}`, {
      ...task,
      completed: !task.completed,
    });
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-105">
        <h1 className="text-xl font-bold mb-4">Task Manager</h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full"
        >
          {showForm ? "Close" : "Add Task"}
        </button>

        {showForm && <TaskForm addTask={addTask} closeForm={() => setShowForm(false)} />}

        <TaskList
          tasks={tasks}
          deleteTask={deleteTask}
          updateTask={updateTask}
          toggleComplete={toggleComplete}
        />
      </div>
    </div>
  );
}

export default App;



// Show in list on basis of deadline (sorting) nearest deadline show on top of the list.
// filter on basis of deadline, name.
// AI integration.