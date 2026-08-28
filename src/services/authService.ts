import type { LoginResult } from "../types/auth";

export interface AuthService {
  login(email: string, password: string): Promise<LoginResult>;
}
