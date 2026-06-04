import api from "./api";

export const formatDateTime = (dateStr) => {
  if (!dateStr) return null;
  return dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`;
};

export const toDateTimeInputValue = (dateStr) => {
  if (!dateStr) return "";
  return dateStr.slice(0, 16);
};

export const formatDisplayDateTime = (dateStr) => {
  if (!dateStr) return "No deadline";

  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) {
    return dateStr;
  }

  return parsed.toLocaleString();
};

export const getTasks = (params) => api.get("/tasks", { params });

export const createTask = (task) => api.post("/tasks", task);
export const updateTask = (id, task) => api.put(`/tasks/${id}`, task);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export const parseNaturalLanguageTask = (text) =>
  api.post("/ai/parse-task", { text });

export const getPrioritizedTasks = () => api.get("/ai/prioritize");

export const getProductivityInsights = () => api.get("/ai/insights");

export const askAiQuestion = (question) => api.post("/ai/chat", { question });
