import { loginResponseSchema } from "../../schemas/auth";
import type { AuthService } from "../authService";
import { request } from "./httpClient";

export const httpAuthService: AuthService = {
  async login(email: string, password: string) {
    const response = await request("/Auth/login", {
      method: "POST",
      body: { username: email, password },
      schema: loginResponseSchema,
    });

    return {
      session: {
        token: response.token,
        username: response.username,
        expiresAt: response.expiresAt,
      },
      user: response.user,
    };
  },
};
