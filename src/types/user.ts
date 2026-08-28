export type UserRole = "User" | "Admin";

export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  isActive: boolean;
}

export type UserInput = Pick<User, "email" | "phoneNumber" | "role"> & {
  password: string;
};
