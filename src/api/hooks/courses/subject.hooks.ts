import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse, Pagination } from "@/types/api.types";
import type { Subject } from "@/types/courses/course.types";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";

export interface SubjectFilters {
  page?: number;
  limit?: number;
  courseId?: string;
}

export const useSubjects = (params: SubjectFilters = {}) => {
  return useQuery({
    queryKey: ["subjects", params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ subjects: Subject[]; pagination: Pagination }>>(
        "/subjects",
        { params }
      );
      return data.data;
    },
  });
};

export const useSubject = (id: string) => {
  return useQuery({
    queryKey: ["subjects", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ subject: Subject }>>(`/subjects/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Subject>) => {
      const { data } = await api.post<ApiResponse<{ subject: Subject }>>("/subjects", payload);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      if (data.subject.courseId) {
        queryClient.invalidateQueries({ queryKey: ["courses", data.subject.courseId] });
      }
      showSuccessMessage("Subject created successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Subject> & { id: string }) => {
      const { data } = await api.put<ApiResponse<{ subject: Subject }>>(`/subjects/${id}`, payload);
      return data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      queryClient.invalidateQueries({ queryKey: ["subjects", variables.id] });
      if (data.subject.courseId) {
        queryClient.invalidateQueries({ queryKey: ["courses", data.subject.courseId] });
      }
      showSuccessMessage("Subject updated successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/subjects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      showSuccessMessage("Subject deleted successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};
