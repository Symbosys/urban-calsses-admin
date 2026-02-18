export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
export type CourseStatus = "DRAFT" | "UNDER_REVIEW" | "PUBLISHED" | "ARCHIVED";

export interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  thumbnail?: {
    url: string;
    publicId: string;
  };
  price: number;
  discountPrice?: number;
  language: string;
  level: CourseLevel;
  status: CourseStatus;
  isFeatured: boolean;
  durationMonths: number;
  totalLessons: number;
  createdAt: string;
  updatedAt: string;
  subCategory?: {
    name: string;
  };
  instructors?: Array<{
    instructor: {
      name: string;
    };
  }>;
}

export interface CourseFilters {
  page?: number;
  limit?: number;
  status?: CourseStatus;
}
