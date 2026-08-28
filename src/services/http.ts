import { z } from "zod";
import { env } from "../config/env";
import { AppError } from "./appError";
import { tokenStore } from "./tokenStore";

const errorResponseSchema = z.object({
  errorCode: z.string(),
  message: z.string(),
});

const validationProblemSchema = z.object({
  errors: z.record(z.string(), z.array(z.string())),
});

let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = `${env.apiBaseUrl}${path}`;
  if (!query) return url;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params.set(key, String(value));
  }

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
}

async function toAppError(response: Response, hadToken: boolean): Promise<AppError> {
  if (response.status === 401 && hadToken && onUnauthorized) {
    onUnauthorized();
  }

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  const parsedError = errorResponseSchema.safeParse(payload);
  if (parsedError.success) {
    return new AppError(parsedError.data.message, response.status);
  }

  const parsedValidation = validationProblemSchema.safeParse(payload);
  if (parsedValidation.success) {
    const firstMessage = Object.values(parsedValidation.data.errors).flat()[0];
    if (firstMessage) {
      return new AppError(firstMessage, response.status);
    }
  }

  if (response.status === 401) {
    return new AppError("Your session has expired. Please sign in again.", 401);
  }
  if (response.status === 403) {
    return new AppError("You do not have permission to do that.", 403);
  }
  if (response.status === 429) {
    return new AppError("Too many attempts. Please wait a moment and try again.", 429);
  }

  return new AppError("Something went wrong. Please try again.", response.status);
}

export async function request<T>(path: string, schema: z.ZodType<T>, options: RequestOptions = {}): Promise<T> {
  const token = tokenStore.get();
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, options.query), {
      method: options.method ?? "GET",
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new AppError("Unable to reach the server. Please check your connection.", 0);
  }

  if (!response.ok) {
    throw await toAppError(response, token !== null);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new AppError("Something went wrong. Please try again.", response.status);
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new AppError("Something went wrong. Please try again.", response.status);
  }

  return parsed.data;
}
