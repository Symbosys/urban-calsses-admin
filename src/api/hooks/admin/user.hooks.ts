import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse } from "@/types/api.types";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";

export const useUsers = (params?: any) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<any>>("/users", { params });
      return data.data;
    },
  });
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isBlocked }: { id: string; isBlocked: boolean }) => {
      const { data } = await api.patch<ApiResponse<any>>(`/users/${id}/block`, { isBlocked });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessMessage("User status updated");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};
