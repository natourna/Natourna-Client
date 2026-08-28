import { pagedSchema } from "../../schemas/common";
import { userSchema } from "../../schemas/user";
import type { UserInput } from "../../types/user";
import type { UserListParams, UserService } from "../userService";
import { request } from "./httpClient";

const pagedUsersSchema = pagedSchema(userSchema);

export const httpUserService: UserService = {
  getUsers(params: UserListParams) {
    return request("/User", {
      query: {
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
      },
      schema: pagedUsersSchema,
    });
  },

  getCurrentUser() {
    return request("/User/me", { schema: userSchema });
  },

  createUser(input: UserInput) {
    return request("/User", {
      method: "POST",
      body: {
        email: input.email,
        password: input.password,
        phoneNumber: input.phoneNumber,
        role: input.role,
      },
      schema: userSchema,
    });
  },

  setUserActive(id: string, isActive: boolean) {
    return request(`/User/${id}/active`, {
      method: "PATCH",
      body: isActive,
      schema: userSchema,
    });
  },
};
