import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse, Pagination } from "../../../types/api.types";
import type {
  Result,
  ResultFilters,
  CreateResultInput,
  UpdateResultInput
} from "../../../types/results/result.types";
import { showErrorMessage, showSuccessMessage } from "../../../utils/message";

export const useResults = (params: ResultFilters = {}) => {
  return useQuery({
    queryKey: ["results", params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ results: Result[]; pagination: Pagination }>>(
        "/results",
        { params }
      );
      return data.data;
    },
  });
};

export const useResult = (id: string) => {
  return useQuery({
    queryKey: ["results", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ result: Result }>>(`/results/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useCreateResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateResultInput) => {
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
      const { data } = await api.post<ApiResponse<{ result: Result }>>("/results", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
      showSuccessMessage("Result created successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useUpdateResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateResultInput & { id: string }) => {
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
      const { data } = await api.patch<ApiResponse<{ result: Result }>>(`/results/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
      queryClient.invalidateQueries({ queryKey: ["results", variables.id] });
      showSuccessMessage("Result updated successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useDeleteResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/results/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
      showSuccessMessage("Result deleted successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};
