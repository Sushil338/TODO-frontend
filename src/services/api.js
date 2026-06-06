import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL;
export const AUTH_TOKEN_KEY = "todo_auth_token";
export const AUTH_USER_KEY = "todo_auth_user";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const isAuthRequest = config.url?.includes("/auth/login")
    || config.url?.includes("/auth/register");
  if (token && !isAuthRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthRequest = error.config?.url?.includes("/auth/login")
        || error.config?.url?.includes("/auth/register");

      // Extract the exact message text returned by RestAuthenticationEntryPoint
      const serverMessage = error.response?.data?.message;

      // FIX: Only forcefully kick them out if it is explicitly an expired or invalid token error
      if (!isAuthRequest && (serverMessage === "JWT token has expired" || serverMessage === "JWT token is invalid")) {
        console.warn("JWT Session invalid/expired. Booting to login screen...");
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        window.dispatchEvent(new Event("todo-auth-expired"));
      }
    }
    return Promise.reject(error);
  }
);
export default api;
