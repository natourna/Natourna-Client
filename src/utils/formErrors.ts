import type { z } from "zod";

export type FieldErrors<T> = Partial<Record<keyof T & string, string>>;

export function toFieldErrors<T>(error: z.ZodError<T>): FieldErrors<T> {
  const fieldErrors: FieldErrors<T> = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in fieldErrors)) {
      (fieldErrors as Record<string, string>)[key] = issue.message;
    }
  }

  return fieldErrors;
}
