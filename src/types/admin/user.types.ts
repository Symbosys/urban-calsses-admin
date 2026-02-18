export type Role = "STUDENT" | "INSTRUCTOR" | "ADMIN";

export interface UserAccount {
  id: string;
  role: Role;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  isVerified: boolean;
  isBlocked: boolean;
  account: UserAccount;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: Role;
}
