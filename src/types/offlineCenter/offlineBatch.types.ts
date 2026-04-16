import type { OfflineCenter } from "./offlineCenter.types";
import type { Course } from "../courses/course.types";

export interface OfflineBatch {
  id: string;
  name: string;
  capacity: number;
  startDate: string;
  endDate: string;
  startTime?: string | null;
  endTime?: string | null;
  daysOfWeek: string[];
  isActive: boolean;
  courseId: string;
  centerId: string;
  course?: Course;
  center?: OfflineCenter;
  _count?: {
    bookings: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OfflineBatchFilters {
  courseId?: string;
  centerId?: string;
  isActive?: boolean;
}

export interface CreateOfflineBatchInput {
  name: string;
  capacity: number;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  daysOfWeek: string[];
  isActive?: boolean;
  courseId: string;
  centerId: string;
}

export interface UpdateOfflineBatchInput extends Partial<CreateOfflineBatchInput> {
  id: string;
}
