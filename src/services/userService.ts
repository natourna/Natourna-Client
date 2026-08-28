import type { PagedResult } from "../types/paged";
import type { User, UserInput } from "../types/user";

export interface UserService {
  getUsers(): Promise<User[]>;
  getUsersPage(page: number, pageSize: number): Promise<PagedResult<User>>;
  getCurrentUser(): Promise<User>;
  createUser(input: UserInput): Promise<User>;
  setUserActive(id: string, isActive: boolean): Promise<User>;
}
