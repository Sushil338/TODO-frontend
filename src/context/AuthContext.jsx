import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  clearAuth,
  getProfile,
  getStoredToken,
  getStoredUser,
  login as loginRequest,
  logout as logoutRequest,
  persistAuth,
  register as registerRequest,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(getStoredToken);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(token);

  const applyAuth = useCallback((authResponse) => {
    const nextToken = authResponse.data.token;
    const nextUser = authResponse.data.user;

    persistAuth({ token: nextToken, user: nextUser });
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  // 1. CRITICAL MOVE: Declared refreshProfile BEFORE the useEffect block
  const refreshProfile = useCallback(async () => {
    if (!getStoredToken()) {
      setUser(null);
      setToken(null);
      return;
    }

    try {
      const response = await getProfile();
      const nextUser = response.data;
      persistAuth({ token: getStoredToken(), user: nextUser });
      setUser(nextUser);
      setToken(getStoredToken());
    } catch (error) {
      // Forward the error to the initializer hook so it can wipe states cleanly
      throw error;
    }
  }, []);

  // 2. The Setup Hook now recognizes refreshProfile cleanly in its outer scope
  useEffect(() => {
    const initialize = async () => {
      if (!getStoredToken()) {
        setLoading(false);
        return;
      }

      try {
        await refreshProfile();
      } catch {
        // If the profile fetch fails on application boot, clear auth state safely
        clearAuth();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    // Handler function for when Axios catches a 401 token expiration
    const handleExpired = () => {
      console.warn("Session expired! Resetting AuthContext state...");
      clearAuth();    // Clears localStorage
      setUser(null);  // Resets context user state
      setToken(null); // Resets context token state (Sets isAuthenticated to false)
    };

    // Initialize state
    initialize();

    // Listen to the custom event dispatched from api.js interceptor
    window.addEventListener("todo-auth-expired", handleExpired);

    // Clean up event listener when context unmounts
    return () => {
      window.removeEventListener("todo-auth-expired", handleExpired);
    };
  }, [refreshProfile]); // Safely track refreshProfile changes

  const login = useCallback(async (credentials) => {
    const response = await loginRequest(credentials);
    applyAuth(response);
    return response.data.user;
  }, [applyAuth]);

  const register = useCallback(async (payload) => {
    // Simply forward request to backend; it sends OTP and does NOT return a token yet
    const response = await registerRequest(payload);
    return response.data; // Will contain { message: "...", email: "..." }
  }, []);

  const verifyOtp = useCallback(async (email, otp) => {
    const response = await import("../services/authService").then(m => m.verifyRegisterOtp({ email, otp }));
    // Once OTP matches, backend provides the token and user entity
    applyAuth(response);
    return response.data.user;
  }, [applyAuth]);

  const logout = useCallback(async () => {
    try {
      if (getStoredToken()) {
        await logoutRequest();
      }
    } catch {
      // Logout is client-side for JWT; continue clearing local state.
    } finally {
      clearAuth();
      setUser(null);
      setToken(null);
    }
  }, []);

  const sendForgotPasswordOtp = useCallback(async (email) => {
  const response = await import("../services/authService").then(m => m.forgotPassword({ email }));
  return response.data;
}, []);

const submitPasswordReset = useCallback(async (email, otp, newPassword) => {
  const response = await import("../services/authService").then(m => m.resetPassword({ email, otp, newPassword }));
  return response.data;
}, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated,
      login,
      register,
      verifyOtp,
      sendForgotPasswordOtp,
      submitPasswordReset,
      logout,
      refreshProfile,
    }),
    [user, token, loading, isAuthenticated, login, register, verifyOtp, sendForgotPasswordOtp, submitPasswordReset, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}