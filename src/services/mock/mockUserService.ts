import type { UserService } from "../userService";
import { AppError } from "../appError";
import { clone, db, delay, findOrFail, nextId } from "./database";

export const mockUserService: UserService = {
  async getUsers() {
    await delay();
    return clone(db.users);
  },

  async getCurrentUser() {
    await delay();
    if (!db.currentUserId) throw new AppError("You are not signed in.", 401);
    return clone(findOrFail(db.users, db.currentUserId, "User"));
  },

  async createUser(input) {
    await delay();
    const user = { id: nextId("user"), isActive: true, ...input };
    db.users.push(user);
    return clone(user);
  },

  async setUserActive(id, isActive) {
    await delay();
    const user = findOrFail(db.users, id, "User");
    user.isActive = isActive;
    return clone(user);
  },
};
