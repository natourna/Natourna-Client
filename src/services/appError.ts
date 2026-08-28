export class AppError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;
  return "Something went wrong. Please try again.";
}
