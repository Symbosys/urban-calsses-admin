import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse, Pagination } from "@/types/api.types";
import type { 
  Review, 
  CreateReviewInput 
} from "@/types/user/user.types";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";

export const useCourseReviews = (courseId: string, params: { page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: ["reviews", "course", courseId, params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ reviews: Review[]; pagination: Pagination }>>(
        `/reviews/course/${courseId}`,
        { params }
      );
      return data.data;
    },
    enabled: !!courseId,
  });
};

export const useMyReview = (courseId: string, userId: string) => {
  return useQuery({
    queryKey: ["reviews", "my", courseId, userId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ review: Review }>>(`/reviews/my/${courseId}`, {
        params: { userId }
      });
      return data.data;
    },
    enabled: !!courseId && !!userId,
  });
};

export const useAdminReviews = (params: { page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: ["reviews", "admin", params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ reviews: Review[]; pagination: Pagination }>>(
        "/reviews",
        { params }
      );
      return data.data;
    },
  });
};

export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateReviewInput & { userId: string }) => {
      const { data } = await api.post<ApiResponse<{ review: Review }>>("/reviews", payload);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["courses", data.review.courseId] });
      showSuccessMessage("Review submitted successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useToggleReviewVisibility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isVisible }: { id: string; isVisible: boolean }) => {
      const { data } = await api.patch<ApiResponse<{ review: Review }>>(`/reviews/${id}/visibility`, { isVisible });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      showSuccessMessage("Review visibility updated");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      showSuccessMessage("Review deleted successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};
