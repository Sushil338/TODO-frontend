import { useCallback, useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import {
  createTask,
  deleteTask as deleteTaskAPI,
  getTasks,
  updateTask as updateTaskAPI,
} from "./services/taskServices";

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(
    async (pageToLoad = page) => {
      try {
        setError("");

        const params = {
          page: pageToLoad,
          size,
          search: search || null,
          completed: filter === "all" ? null : filter === "completed",
          sortBy: "deadline",
          direction: "asc",
        };

        const res = await getTasks(params);
        setTasks(res.data.content);
        setTotalPages(res.data.totalPages);

        if (res.data.totalPages > 0 && pageToLoad >= res.data.totalPages) {
          setPage(res.data.totalPages - 1);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load tasks. Please check that the backend is running.");
      }
    },
    [filter, page, search, size]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (task) => {
    setError("");
    await createTask(task);
    setPage(0);
    await fetchTasks(0);
  };

  const handleDelete = async (id) => {
    setError("");
    await deleteTaskAPI(id);
    await fetchTasks();
  };

  const handleUpdate = async (id, updatedTask) => {
    setError("");
    await updateTaskAPI(id, updatedTask);
    await fetchTasks();
  };

  const toggleComplete = async (task) => {
    setError("");
    await updateTaskAPI(task.id, {
      ...task,
      completed: !task.completed,
    });
    await fetchTasks();
  };

  const handleFilterChange = (nextFilter) => {
    setFilter(nextFilter);
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-[420px]">
        <h1 className="text-xl font-bold mb-4">Task Manager</h1>

        <div className="flex gap-2 mb-3">
          <button onClick={() => handleFilterChange("all")}>All</button>
          <button onClick={() => handleFilterChange("completed")}>
            Completed
          </button>
          <button onClick={() => handleFilterChange("pending")}>Pending</button>
        </div>

        <input
          placeholder="Search..."
          value={search}
          onChange={handleSearchChange}
          className="border p-2 w-full mb-3"
        />

        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full"
        >
          {showForm ? "Close" : "Add Task"}
        </button>

        {showForm && (
          <TaskForm
            addTask={addTask}
            closeForm={() => setShowForm(false)}
          />
        )}

        <TaskList
          tasks={tasks}
          deleteTask={handleDelete}
          updateTask={handleUpdate}
          toggleComplete={toggleComplete}
        />

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage((currentPage) => currentPage - 1)}
            disabled={page === 0}
            className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
          </span>

          <button
            onClick={() => setPage((currentPage) => currentPage + 1)}
            disabled={totalPages === 0 || page >= totalPages - 1}
            className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
