import type { AuthService } from "../authService";
import { request } from "../http";
import { tokenStore } from "../tokenStore";
import { authSessionSchema } from "./schemas";

export const apiAuthService: AuthService = {
  async login(email, password) {
    const session = await request("/Auth/login", authSessionSchema, {
      method: "POST",
      body: { username: email, password },
    });
    tokenStore.set(session.token);
    return session;
  },
};
