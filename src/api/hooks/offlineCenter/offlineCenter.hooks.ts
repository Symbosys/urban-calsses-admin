import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse } from "../../../types/api.types";
import type {
  OfflineCenter,
  OfflineCenterFilters,
  CreateOfflineCenterInput,
  UpdateOfflineCenterInput
} from "../../../types/offlineCenter/offlineCenter.types";
import { showErrorMessage, showSuccessMessage } from "../../../utils/message";

export const useOfflineCenters = (params: OfflineCenterFilters = {}) => {
  return useQuery({
    queryKey: ["offline-centers", params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ centers: OfflineCenter[] }>>(
        "/offline-centers",
        { params }
      );
      return data.data;
    },
  });
};

export const useOfflineCenter = (id: string) => {
  return useQuery({
    queryKey: ["offline-centers", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ center: OfflineCenter }>>(`/offline-centers/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useCreateOfflineCenter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateOfflineCenterInput) => {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const { data } = await api.post<ApiResponse<{ center: OfflineCenter }>>("/offline-centers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offline-centers"] });
      showSuccessMessage("Offline center created successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useUpdateOfflineCenter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateOfflineCenterInput & { id: string }) => {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const { data } = await api.patch<ApiResponse<{ center: OfflineCenter }>>(`/offline-centers/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offline-centers"] });
      queryClient.invalidateQueries({ queryKey: ["offline-centers", variables.id] });
      showSuccessMessage("Offline center updated successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useDeleteOfflineCenter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/offline-centers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offline-centers"] });
      showSuccessMessage("Offline center deleted successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};
