import { z } from "zod";
import { userSchema } from "./user";

export const authSessionSchema = z.object({
  token: z.string(),
  username: z.string(),
  expiresAt: z.string(),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  username: z.string(),
  expiresAt: z.string(),
  user: userSchema,
});

export const loginInputSchema = z.object({
  email: z.string().trim().min(1, "Please enter your email and password."),
  password: z.string().min(1, "Please enter your email and password."),
});
