import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse, Pagination } from "@/types/api.types";
import type { 
  AdminUser, 
  UserFilters 
} from "@/types/admin/user.types";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";

export const useUsers = (params: UserFilters = {}) => {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ users: AdminUser[]; pagination: Pagination }>>(
        "/admin/users",
        { params }
      );
      return data.data;
    },
  });
};

export const useToggleUserVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch<ApiResponse<any>>(`/admin/users/${id}/verify`);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      showSuccessMessage(data.message || "User verification toggled successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useToggleUserBlock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch<ApiResponse<any>>(`/admin/users/${id}/block`);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      showSuccessMessage(data.message || "User block status toggled successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};
