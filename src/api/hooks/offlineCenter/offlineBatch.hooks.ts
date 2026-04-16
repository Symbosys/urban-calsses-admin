import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse } from "../../../types/api.types";
import type { 
  OfflineBatch, 
  OfflineBatchFilters, 
  CreateOfflineBatchInput, 
  UpdateOfflineBatchInput 
} from "../../../types/offlineCenter/offlineBatch.types";
import { showErrorMessage, showSuccessMessage } from "../../../utils/message";

export const useOfflineBatches = (params: OfflineBatchFilters = {}) => {
  return useQuery({
    queryKey: ["offline-batches", params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ batches: OfflineBatch[] }>>(
        "/offline-batches",
        { params }
      );
      return data.data;
    },
  });
};

export const useOfflineBatch = (id: string) => {
  return useQuery({
    queryKey: ["offline-batches", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ batch: OfflineBatch }>>(
        `/offline-batches/${id}`
      );
      return data.data;
    },
    enabled: !!id,
  });
};

export const useCreateOfflineBatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateOfflineBatchInput) => {
      const { data } = await api.post<ApiResponse<{ batch: OfflineBatch }>>(
        "/offline-batches",
        payload
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offline-batches"] });
      showSuccessMessage("Batch created successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useUpdateOfflineBatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateOfflineBatchInput) => {
      const { data } = await api.patch<ApiResponse<{ batch: OfflineBatch }>>(
        `/offline-batches/${id}`,
        payload
      );
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offline-batches"] });
      queryClient.invalidateQueries({ queryKey: ["offline-batches", variables.id] });
      showSuccessMessage("Batch updated successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useDeleteOfflineBatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/offline-batches/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offline-batches"] });
      showSuccessMessage("Batch deleted successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};
