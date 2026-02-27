
import type { Category } from "../courses/course.types";

export interface Result {
  id: string;
  studentName: string;
  rank: string;
  examName: string;
  year: number;
  image?: {
    secure_url: string;
    public_id: string;
  } | null;
  college?: string | null;
  quote?: string | null;
  isFeatured: boolean;
  categoryId?: string | null;
  category?: Category | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResultFilters {
  categoryId?: string;
  isFeatured?: boolean;
  studentName?: string;
  page?: number;
  limit?: number;
}

export interface CreateResultInput {
  studentName: string;
  rank: string;
  examName: string;
  year: number;
  image?: File | null | any;
  college?: string | null;
  quote?: string | null;
  isFeatured?: boolean;
  categoryId?: string | null;
}

export interface UpdateResultInput extends Partial<CreateResultInput> {}
