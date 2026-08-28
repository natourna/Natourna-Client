import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { AuthSession } from "../types/auth";
import type { User } from "../types/user";
import { authService, userService } from "../services";
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
  const [auth, setAuth] = useState<StoredAuth | null>(readStoredAuth);

  const login = useCallback(async (email: string, password: string) => {
    const session = await authService.login(email, password);
    const user = await userService.getCurrentUser();
    const next = { session, user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setAuth(next);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  }, []);

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
