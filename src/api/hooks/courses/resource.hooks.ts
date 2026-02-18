import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse } from "@/types/api.types";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";

export interface LessonResource {
  id: string;
  title: string;
  file: {
    url: string;
    publicId: string;
    fileName: string;
    size: number;
    mimeType: string;
  };
  lessonId: string;
  createdAt: string;
  updatedAt: string;
}

export const useLessonResources = (lessonId: string) => {
  return useQuery({
    queryKey: ["lessons", lessonId, "resources"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ resources: LessonResource[] }>>(
        `/lessons/${lessonId}/resources`
      );
      return data.data;
    },
    enabled: !!lessonId,
  });
};

export const useAddResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; file: any; lessonId: string }) => {
      const { data } = await api.post<ApiResponse<{ resource: LessonResource }>>(
        "/lessons/resources",
        payload
      );
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lessons", data.resource.lessonId, "resources"] });
      showSuccessMessage("Resource added successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const { data } = await api.patch<ApiResponse<{ resource: LessonResource }>>(
        `/lessons/resources/${id}`,
        { title }
      );
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lessons", data.resource.lessonId, "resources"] });
      showSuccessMessage("Resource updated successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/lessons/resources/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      showSuccessMessage("Resource deleted successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};
