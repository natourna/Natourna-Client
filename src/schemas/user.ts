import { z } from "zod";
import { idSchema } from "./common";

export const userRoleSchema = z.enum(["User", "Admin"]);

export const userSchema = z.object({
  id: idSchema,
  email: z.string(),
  phoneNumber: z.string(),
  role: userRoleSchema,
  isActive: z.boolean(),
});

export const userInputSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "The password must be at least 8 characters."),
  phoneNumber: z.string().trim().min(1, "Enter a phone number."),
  role: userRoleSchema,
});
