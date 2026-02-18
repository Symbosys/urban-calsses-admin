import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse, Pagination } from "@/types/api.types";
import type { 
  StudentUser, 
  UpdateUserPayload // Assuming partial StudentUser
} from "@/types/user/user.types";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";

export const useUsers = (params: { page?: number; limit?: number; search?: string } = {}) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ users: StudentUser[]; pagination: Pagination }>>(
        "/users",
        { params }
      );
      return data.data;
    },
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ user: StudentUser }>>(`/users/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateUserPayload & { id: string }) => {
      const { data } = await api.put<ApiResponse<{ user: StudentUser }>>(`/users/${id}`, payload);
      return data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] });
      showSuccessMessage("Profile updated successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessMessage("Account deleted successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};
