import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { z } from "zod";
import { authService, userService } from "../services";
import { setOnUnauthorized } from "../services/http";
import { tokenStore } from "../services/tokenStore";
import { AuthContext } from "./authContext";

const storedAuthSchema = z.object({
  session: z.object({
    token: z.string(),
    username: z.string(),
    expiresAt: z.string(),
  }),
  user: z.object({
    id: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    role: z.enum(["User", "Admin"]),
    isActive: z.boolean(),
  }),
});

type StoredAuth = z.infer<typeof storedAuthSchema>;

const STORAGE_KEY = "natourna.auth";

function readStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = storedAuthSchema.safeParse(JSON.parse(raw));
    if (!parsed.success || new Date(parsed.data.session.expiresAt) <= new Date()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    tokenStore.set(parsed.data.session.token);
    return parsed.data;
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
    tokenStore.set(null);
    setAuth(null);
  }, []);

  useEffect(() => {
    setOnUnauthorized(logout);
    return () => setOnUnauthorized(null);
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
