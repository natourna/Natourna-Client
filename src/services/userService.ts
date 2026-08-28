import type { Paged, PageParams } from "../types/paging";
import type { User, UserInput } from "../types/user";

export interface UserListParams extends PageParams {
  search?: string;
}

export interface UserService {
  getUsers(params: UserListParams): Promise<Paged<User>>;
  getCurrentUser(): Promise<User>;
  createUser(input: UserInput): Promise<User>;
  setUserActive(id: string, isActive: boolean): Promise<User>;
}
