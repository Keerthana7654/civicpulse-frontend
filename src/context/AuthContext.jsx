import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("civicpulse_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("civicpulse_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("civicpulse_user");
    }
  }, [user]);

  async function login(email, password) {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      localStorage.setItem("civicpulse_token", data.token);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  }

  async function register(payload) {
    setLoading(true);
    try {
      const data = await authService.register(payload);
      localStorage.setItem("civicpulse_token", data.token);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("civicpulse_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
