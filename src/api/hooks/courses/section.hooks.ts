import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse, Pagination } from "@/types/api.types";
import type { Section } from "@/types/courses/course.types";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";

export interface SectionFilters {
  page?: number;
  limit?: number;
  subjectId?: string;
}

export const useSections = (params: SectionFilters = {}) => {
  return useQuery({
    queryKey: ["sections", params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ sections: Section[]; pagination: Pagination }>>(
        "/sections",
        { params }
      );
      return data.data;
    },
  });
};

export const useSection = (id: string) => {
  return useQuery({
    queryKey: ["sections", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ section: Section }>>(`/sections/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useCreateSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Section>) => {
      const { data } = await api.post<ApiResponse<{ section: Section }>>("/sections", payload);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      if (data.section.subjectId) {
        queryClient.invalidateQueries({ queryKey: ["subjects", data.section.subjectId] });
      }
      showSuccessMessage("Section created successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useUpdateSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Section> & { id: string }) => {
      const { data } = await api.put<ApiResponse<{ section: Section }>>(`/sections/${id}`, payload);
      return data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      queryClient.invalidateQueries({ queryKey: ["sections", variables.id] });
      if (data.section.subjectId) {
        queryClient.invalidateQueries({ queryKey: ["subjects", data.section.subjectId] });
      }
      showSuccessMessage("Section updated successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useDeleteSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/sections/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      showSuccessMessage("Section deleted successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};
