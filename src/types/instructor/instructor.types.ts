import type { Course } from "../admin/course.types";
import type { UserAccount } from "../admin/user.types";

export interface Instructor {
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
  bio?: string;
  specialization?: string;
  experience?: number;
  rating: number;
  _count?: {
    courses: number;
  };
  courses?: Array<{
    course: Course;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInstructorInput {
  name?: string;
  email: string;
  phone?: string;
  bio?: string;
  specialization?: string;
  experience?: number;
  avatar?: {
    url: string;
    publicId: string;
  };
}

export interface UpdateInstructorInput extends Partial<CreateInstructorInput> {
  isVerified?: boolean;
  isBlocked?: boolean;
}

export interface InstructorFilters {
  page?: number;
  limit?: number;
  search?: string;
}
