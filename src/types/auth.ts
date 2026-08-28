import type { z } from "zod";
import type { authSessionSchema } from "../schemas/auth";
import type { User } from "./user";

export type AuthSession = z.infer<typeof authSessionSchema>;

export interface LoginResult {
  session: AuthSession;
  user: User;
}
