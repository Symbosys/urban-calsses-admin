import type { UserAccount } from "../admin/user.types";
import type { Course } from "../courses/course.types";

export interface StudentUser {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  avatar?: {
    url: string;
    publicId: string;
  };
  isVerified: boolean;
  isBlocked: boolean;
  accountId: string;
  account?: UserAccount;
  createdAt: string;
  updatedAt: string;
  goals?: UserGoal[];
}

export interface UserGoal {
  id: string;
  userId: string;
  subCategoryId: string;
  subCategory?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface LessonProgress {
  id: string;
  isCompleted: boolean;
  completedAt?: string;
  userId: string;
  lessonId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  isVisible: boolean;
  userId: string;
  user?: Partial<StudentUser>;
  courseId: string;
  course?: Partial<Course>;
  createdAt: string;
  updatedAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  courseId: string;
  course?: Course;
  createdAt: string;
}

export interface CreateReviewInput {
  courseId: string;
  rating: number;
  comment?: string;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  avatar?: {
    url: string;
    publicId: string;
  };
  isBlocked?: boolean;
}

export interface LessonProgressInput {
  lessonId: string;
  isCompleted: boolean;
}

export interface AuthResponse {
  user: StudentUser;
  token: string;
}

export interface OtpResponse {
  otp: string; // Sent only in dev usually, but for type consistency
}
