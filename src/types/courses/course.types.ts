import type { ApiResponse, Pagination } from "@/types/api.types";

export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
export type CourseStatus = "DRAFT" | "UNDER_REVIEW" | "PUBLISHED" | "ARCHIVED";
export type LessonType = "VIDEO" | "PDF" | "QUIZ" | "TEXT" | "LIVE";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: {
    secure_url: string;
    public_id: string;
  };
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    subCategories: number;
  };
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: {
    secure_url: string;
    public_id: string;
  };
  order: number;
  isActive: boolean;
  categoryId: string;
  category?: Partial<Category>;
  createdAt: string;
  updatedAt: string;
  _count?: {
    courses: number;
  };
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  thumbnail?: {
    secure_url: string;
    public_id: string;
  };
  previewVideo?: {
    secure_url: string;
    public_id: string;
    duration?: number;
  };
  price: number;
  discountPrice?: number;
  language: string;
  level: CourseLevel;
  status: CourseStatus;
  isFeatured: boolean;
  durationMonths: number;
  totalLessons: number;
  subCategoryId: string;
  subCategory?: SubCategory;
  createdAt: string;
  updatedAt: string;
  _count?: {
    enrollments: number;
    subjects: number;
    reviews: number;
  };
  instructors?: Array<{
    instructor: {
      id: string;
      name: string;
      avatar?: { secure_url: string };
    };
  }>;
  tags?: Array<{ id: string; name: string }>;
  subjects?: Subject[];
}

export interface Subject {
  id: string;
  title: string;
  description?: string;
  icon?: {
    secure_url: string;
    public_id: string;
  };
  order: number;
  courseId: string;
  course?: Partial<Course>;
  sections?: Section[];
  createdAt: string;
  updatedAt: string;
  _count?: {
    sections: number;
  };
}

export interface Section {
  id: string;
  title: string;
  order: number;
  subjectId: string;
  subject?: Partial<Subject>;
  lessons?: Lesson[];
  createdAt: string;
  updatedAt: string;
  _count?: {
    lessons: number;
  };
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  type: LessonType;
  content?: string;
  video?: {
    url: string;
    publicId: string;
    duration: number;
    quality?: string;
  };
  attachments?: Array<{
    url: string;
    publicId: string;
    name: string;
    type: string;
    size: number;
  }>;
  duration: number;
  order: number;
  isFree: boolean;
  sectionId: string;
  section?: Partial<Section>;
  createdAt: string;
  updatedAt: string;
}

export interface CourseFilters {
  page?: number;
  limit?: number;
  search?: string;
  subCategoryId?: string;
  status?: CourseStatus;
  level?: CourseLevel;
  isFeatured?: boolean;
}

export interface CreateCourseInput {
  title: string;
  shortDescription?: string;
  description?: string;
  subCategoryId: string;
  price?: number;
  discountPrice?: number;
  language?: string;
  level?: CourseLevel;
  status?: CourseStatus;
  isFeatured?: boolean;
  durationMonths?: number;
  instructorIds?: string[];
  tags?: string[];
  thumbnail?: File | null | any;
  previewVideo?: {
    secure_url: string;
    public_id: string;
    duration?: number;
  } | any;
}

export interface UpdateCourseInput extends Partial<CreateCourseInput> {}
