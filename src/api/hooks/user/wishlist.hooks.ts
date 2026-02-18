import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse, Pagination } from "@/types/api.types";
import type { Course } from "@/types/courses/course.types";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";

export const useWishlist = (userId: string, params: { page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: ["wishlist", userId, params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ wishlist: Course[]; pagination: Pagination }>>(
        "/wishlist",
        { params: { userId, ...params } }
      );
      return data.data;
    },
    enabled: !!userId,
  });
};

export const useWishlistStatus = (courseId: string, userId: string) => {
  return useQuery({
    queryKey: ["wishlist", "status", courseId, userId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ isInWishlist: boolean }>>(
        `/wishlist/check/${courseId}`,
        { params: { userId } }
      );
      return data.data;
    },
    enabled: !!courseId && !!userId,
  });
};

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { courseId: string; userId: string }) => {
      const { data } = await api.post<ApiResponse<{ isInWishlist: boolean }>>("/wishlist/toggle", payload);
      return data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["wishlist", "status", variables.courseId, variables.userId] });
      showSuccessMessage(data.isInWishlist ? "Added to wishlist" : "Removed from wishlist");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useClearWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      await api.delete("/wishlist/clear", { data: { userId } });
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", userId] });
      showSuccessMessage("Wishlist cleared successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};
