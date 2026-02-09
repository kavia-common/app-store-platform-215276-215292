import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../services/apiClient";
import { clearAuthToken, getAuthToken, setAuthToken } from "../services/authStorage";

const AuthContext = createContext(null);

/** PUBLIC_INTERFACE */
export function AuthProvider({ children }) {
  /** Provides auth state (user/token) and auth actions to the application. */
  const [token, setTokenState] = useState(() => getAuthToken());
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [error, setError] = useState(null);

  const setToken = useCallback((nextToken) => {
    setAuthToken(nextToken);
    setTokenState(nextToken || null);
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    setTokenState(null);
    setUser(null);
  }, []);

  const refreshMe = useCallback(async () => {
    setError(null);
    if (!getAuthToken()) {
      setUser(null);
      return;
    }
    try {
      const me = await api.me();
      setUser(me);
    } catch (e) {
      // Token might be invalid/expired; fail closed.
      setUser(null);
      clearAuthToken();
      setTokenState(null);
      setError(e?.message || "Unable to restore session");
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await refreshMe();
      } finally {
        if (mounted) setBooting(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [refreshMe]);

  const login = useCallback(async ({ email, password }) => {
    setError(null);
    const res = await api.login({ email, password });
    const nextToken = res?.token || res?.access_token;
    if (!nextToken) {
      throw new Error("Login succeeded but no token was returned by the API.");
    }
    setToken(nextToken);
    await refreshMe();
  }, [refreshMe, setToken]);

  const register = useCallback(async ({ email, password, displayName }) => {
    setError(null);
    const res = await api.register({ email, password, display_name: displayName });
    const nextToken = res?.token || res?.access_token;
    if (!nextToken) {
      throw new Error("Registration succeeded but no token was returned by the API.");
    }
    setToken(nextToken);
    await refreshMe();
  }, [refreshMe, setToken]);

  const value = useMemo(
    () => ({
      token,
      user,
      booting,
      error,
      isAuthed: Boolean(token && user),
      login,
      register,
      logout,
      refreshMe,
    }),
    [token, user, booting, error, login, register, logout, refreshMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** PUBLIC_INTERFACE */
export function useAuth() {
  /** Hook to access AuthProvider state. */
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}
