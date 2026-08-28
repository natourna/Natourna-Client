import type { z } from "zod";
import type { userInputSchema, userRoleSchema, userSchema } from "../schemas/user";

export type UserRole = z.infer<typeof userRoleSchema>;

export type User = z.infer<typeof userSchema>;

export type UserInput = z.infer<typeof userInputSchema>;
