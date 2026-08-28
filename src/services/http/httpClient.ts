import type { z } from "zod";
import { env } from "../../config/env";
import { AppError } from "../appError";

let authToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
}

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

type QueryValue = string | number | boolean | undefined;

interface RequestOptions<T> {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, QueryValue>;
  schema: z.ZodType<T>;
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const baseUrl = (env.apiBaseUrl ?? "").replace(/\/$/, "");
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) params.set(key, String(value));
  }
  const queryString = params.toString();
  return `${baseUrl}${path}${queryString ? `?${queryString}` : ""}`;
}

async function errorMessageFrom(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as {
      message?: string;
      title?: string;
      errors?: Record<string, string[]>;
    };
    const firstFieldError = body.errors ? Object.values(body.errors).flat()[0] : undefined;
    if (firstFieldError) return firstFieldError;
    if (body.message) return body.message;
    if (body.title) return body.title;
  } catch {
    if (response.status === 429) {
      return "Too many requests. Please wait a moment and try again.";
    }
  }
  return "Something went wrong. Please try again.";
}

export async function request<T>(path: string, options: RequestOptions<T>): Promise<T> {
  if (!env.apiBaseUrl) {
    throw new AppError("The server address is not configured.", 0);
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, options.query), {
      method: options.method ?? "GET",
      headers: {
        ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new AppError("Unable to reach the server. Check your connection and try again.", 0);
  }

  if (response.status === 401 && authToken) {
    onUnauthorized?.();
  }

  if (!response.ok) {
    throw new AppError(await errorMessageFrom(response), response.status);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new AppError("The server returned an unexpected response.", response.status);
  }

  const parsed = options.schema.safeParse(payload);
  if (!parsed.success) {
    throw new AppError("The server returned an unexpected response.", response.status);
  }

  return parsed.data;
}
