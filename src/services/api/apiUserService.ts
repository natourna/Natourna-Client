import { z } from "zod";
import type { UserService } from "../userService";
import { AppError } from "../appError";
import { request } from "../http";
import { fetchAllPages } from "./paged";
import { pagedSchema, roleSchema, userDetailSchema, userSchema } from "./schemas";

const pagedUsersSchema = pagedSchema(userSchema);

export const apiUserService: UserService = {
  getUsers() {
    return fetchAllPages((page, pageSize) => request("/User", pagedUsersSchema, { query: { page, pageSize } }));
  },

  getUsersPage(page, pageSize) {
    return request("/User", pagedUsersSchema, { query: { page, pageSize } });
  },

  getCurrentUser() {
    return request("/User/me", userSchema);
  },

  async createUser(input) {
    const roles = await request("/Role", z.array(roleSchema));
    const role = roles.find((candidate) => candidate.name === input.role);
    if (!role) {
      throw new AppError("The selected role does not exist.", 422);
    }

    return request("/User", userSchema, {
      method: "POST",
      body: {
        email: input.email,
        password: input.password,
        phoneNumber: input.phoneNumber,
        roleId: role.id,
      },
    });
  },

  async setUserActive(id, isActive) {
    const user = await request(`/User/${id}`, userDetailSchema);

    return request(`/User/${id}`, userSchema, {
      method: "PUT",
      body: {
        email: user.email,
        phoneNumber: user.phoneNumber,
        roleId: user.roleId,
        isActive,
      },
    });
  },
};
