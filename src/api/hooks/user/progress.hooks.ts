import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse } from "@/types/api.types";
import type { 
  LessonProgress, 
  LessonProgressInput 
} from "@/types/user/user.types";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";

export interface CourseProgress {
  courseId: string;
  totalLessons: number;
  completedCount: number;
  percentage: number;
  completedLessonIds: string[];
}

export const useLessonProgress = (lessonId: string, userId: string) => {
  return useQuery({
    queryKey: ["progress", "lesson", lessonId, userId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ progress: LessonProgress }>>(
        `/user/progress/${lessonId}`,
        { params: { userId } }
      );
      return data.data;
    },
    enabled: !!lessonId && !!userId,
  });
};

export const useCourseProgress = (courseId: string, userId: string) => {
  return useQuery({
    queryKey: ["progress", "course", courseId, userId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<CourseProgress>>(
        `/user/progress/course/${courseId}`,
        { params: { userId } }
      );
      return data.data;
    },
    enabled: !!courseId && !!userId,
  });
};

export const useUpdateLessonProgress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: LessonProgressInput & { userId: string }) => {
      const { data } = await api.post<ApiResponse<{ progress: LessonProgress }>>("/user/progress", payload);
      return data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["progress", "lesson", variables.lessonId, variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["progress", "course", variables.userId] });
      showSuccessMessage(data.progress.isCompleted ? "Lesson completed" : "Lesson status updated");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};
