import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import AiPanel from "./components/AiPanel";
import AuthPage from "./components/AuthPage";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import UserMenu from "./components/UserMenu";
import LandingPage from "./components/LandingPage";
import {
  createTask,
  deleteTask as deleteTaskAPI,
  getTasks,
  updateTask as updateTaskAPI,
} from "./services/taskServices";

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");
  const [aiRefreshKey, setAiRefreshKey] = useState(0);

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

  const refreshAi = () => {
    setAiRefreshKey((currentKey) => currentKey + 1);
  };

  const addTask = async (task) => {
    setError("");
    await createTask(task);
    setPage(0);
    await fetchTasks(0);
    refreshAi();
  };

  const handleDelete = async (id) => {
    setError("");
    await deleteTaskAPI(id);
    await fetchTasks();
    refreshAi();
  };

  const handleUpdate = async (id, updatedTask) => {
    setError("");
    await updateTaskAPI(id, updatedTask);
    await fetchTasks();
    refreshAi();
  };

  const toggleComplete = async (task) => {
    setError("");
    await updateTaskAPI(task.id, {
      ...task,
      completed: !task.completed,
    });
    await fetchTasks();
    refreshAi();
  };

  const handleFilterChange = (nextFilter) => {
    setFilter(nextFilter);
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const filterButtonClass = (value) =>
    `rounded px-3 py-1 text-sm ${
      filter === value ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-700"
    }`;

  

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto grid w-full max-w-5xl gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <main className="rounded-xl bg-white p-6 shadow-md">
          <h1 className="mb-4 text-xl font-bold">Task Manager</h1>

          <UserMenu />

          <div className="mb-3 flex gap-2">
            <button
              onClick={() => handleFilterChange("all")}
              className={filterButtonClass("all")}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange("completed")}
              className={filterButtonClass("completed")}
            >
              Completed
            </button>
            <button
              onClick={() => handleFilterChange("pending")}
              className={filterButtonClass("pending")}
            >
              Pending
            </button>
          </div>

          <input
            placeholder="Search..."
            value={search}
            onChange={handleSearchChange}
            className="mb-3 w-full rounded border p-2"
          />

          {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

          <button
            onClick={() => setShowForm(!showForm)}
            className="mb-4 w-full rounded bg-blue-600 px-4 py-2 text-white"
          >
            {showForm ? "Close" : "Add Task"}
          </button>

          {showForm && (
            <TaskForm addTask={addTask} closeForm={() => setShowForm(false)} />
          )}

          <TaskList
            tasks={tasks}
            deleteTask={handleDelete}
            updateTask={handleUpdate}
            toggleComplete={toggleComplete}
          />

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setPage((currentPage) => currentPage - 1)}
              disabled={page === 0}
              className="rounded bg-gray-300 px-3 py-1 disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm">
              Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
            </span>

            <button
              onClick={() => setPage((currentPage) => currentPage + 1)}
              disabled={totalPages === 0 || page >= totalPages - 1}
              className="rounded bg-gray-300 px-3 py-1 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </main>

        <AiPanel onTaskCreated={addTask} refreshKey={aiRefreshKey} />
      </div>
    </div>
  );
}

function App() {
  const { isAuthenticated, loading } = useAuth();
  const [showAuthScreen, setShowAuthScreen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 text-sm text-gray-600">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return <TaskManager />;
  }

  if (showAuthScreen) {
    return (
      <div className="relative min-h-screen bg-gray-100">
        <button
          onClick={() => setShowAuthScreen(false)}
          className="absolute top-4 left-4 rounded bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 transition shadow"
        >
          &larr; Back to Home
        </button>
        <AuthPage />
      </div>
    );
  }

  // Default fallback: Show the shiny landing page first!
  return <LandingPage onGetStarted={() => setShowAuthScreen(true)} />;
}

export default App;
