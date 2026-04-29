import axios from "axios";

const API_URL = "http://localhost:8080/api/tasks";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

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

export const getTasks = (params) => api.get("", { params });

export const createTask = (task) => api.post("", task);
export const updateTask = (id, task) => api.put(`/${id}`, task);
export const deleteTask = (id) => api.delete(`/${id}`);
