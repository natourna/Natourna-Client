import type { AuthService } from "../authService";
import { AppError } from "../appError";
import { nameFromEmail } from "../../utils/names";
import { db, delay } from "./database";

const DEMO_PASSWORD = "password";
const SESSION_HOURS = 12;

export const mockAuthService: AuthService = {
  async login(email, password) {
    await delay();
    const user = db.users.find(
      (candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (!user || password !== DEMO_PASSWORD) {
      throw new AppError("That email or password is not right. Please try again.", 401);
    }
    if (!user.isActive) {
      throw new AppError("This account is inactive. Ask your building committee.", 403);
    }
    db.currentUserId = user.id;
    const expiresAt = new Date(Date.now() + SESSION_HOURS * 3600 * 1000).toISOString();
    return { token: `mock-token-${user.id}`, username: nameFromEmail(user.email), expiresAt };
  },
};
