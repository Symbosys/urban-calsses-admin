import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse } from "@/types/api.types";
import type { Lesson } from "@/types/courses/course.types";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";

export interface LessonFilters {
  sectionId?: string;
}

export const useLessons = (params: LessonFilters = {}) => {
  return useQuery({
    queryKey: ["lessons", params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ lessons: Lesson[] }>>(
        "/lessons",
        { params }
      );
      return data.data;
    },
  });
};

export const useLesson = (id: string) => {
  return useQuery({
    queryKey: ["lessons", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ lesson: Lesson }>>(`/lessons/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Lesson>) => {
      const { data } = await api.post<ApiResponse<{ lesson: Lesson }>>("/lessons", payload);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      if (data.lesson.sectionId) {
        queryClient.invalidateQueries({ queryKey: ["sections", data.lesson.sectionId] });
      }
      showSuccessMessage("Lesson created successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Lesson> & { id: string }) => {
      const { data } = await api.put<ApiResponse<{ lesson: Lesson }>>(`/lessons/${id}`, payload);
      return data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({ queryKey: ["lessons", variables.id] });
      if (data.lesson.sectionId) {
        queryClient.invalidateQueries({ queryKey: ["sections", data.lesson.sectionId] });
      }
      showSuccessMessage("Lesson updated successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/lessons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      showSuccessMessage("Lesson deleted successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};
