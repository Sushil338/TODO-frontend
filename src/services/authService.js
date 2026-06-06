import api, { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "./api";

export const login = (credentials) => api.post("/auth/login", credentials);

export const register = (payload) => api.post("/auth/register", payload);

export const verifyRegisterOtp = (payload) => api.post("/auth/verify-register-otp", payload);

export const logout = () => api.post("/auth/logout");

export const getProfile = () => api.get("/auth/me");

export const forgotPassword = (payload) => api.post("/auth/forgot-password", payload);

export const resetPassword = (payload) => api.post("/auth/reset-password", payload);

export const persistAuth = ({ token, user }) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

export const getStoredUser = () => {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getStoredToken = () => localStorage.getItem(AUTH_TOKEN_KEY);
