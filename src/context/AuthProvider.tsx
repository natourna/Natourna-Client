import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AuthSession } from "../types/auth";
import type { User } from "../types/user";
import { authService, setAuthToken, setUnauthorizedHandler } from "../services";
import { AuthContext } from "./authContext";

interface StoredAuth {
  session: AuthSession;
  user: User;
}

const STORAGE_KEY = "natourna.auth";

function readStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as StoredAuth;
    if (new Date(stored.session.expiresAt) <= new Date()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return stored;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StoredAuth | null>(() => {
    const stored = readStoredAuth();
    setAuthToken(stored?.session.token ?? null);
    return stored;
  });

  const login = useCallback(async (email: string, password: string) => {
    const { session, user } = await authService.login(email, password);
    setAuthToken(session.token);
    const next = { session, user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setAuth(next);
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const value = useMemo(
    () => ({
      session: auth?.session ?? null,
      user: auth?.user ?? null,
      login,
      logout,
    }),
    [auth, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
