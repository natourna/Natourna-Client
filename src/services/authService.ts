import type { AuthSession } from "../types/auth";

export interface AuthService {
  login(email: string, password: string): Promise<AuthSession>;
}
