import { createContext } from "react";
import type { AuthSession } from "../types/auth";
import type { User } from "../types/user";

export interface AuthContextValue {
  session: AuthSession | null;
  user: User | null;
  login(email: string, password: string): Promise<void>;
  logout(): void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
