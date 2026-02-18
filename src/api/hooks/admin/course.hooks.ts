import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse, Pagination } from "@/types/api.types";
import type { 
  Course, 
  CourseFilters, 
  CourseStatus 
} from "@/types/admin/course.types";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";

export const useCourses = (params: CourseFilters = {}) => {
  return useQuery({
    queryKey: ["admin", "courses", params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ courses: Course[]; pagination: Pagination }>>(
        "/admin/courses",
        { params }
      );
      return data.data;
    },
  });
};

export const useUpdateCourseStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: CourseStatus }) => {
      const { data } = await api.patch<ApiResponse<{ course: Course }>>(
        `/admin/courses/${id}/status`,
        { status }
      );
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
      showSuccessMessage(`Course status updated to ${data.course.status}`);
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useToggleCourseFeature = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch<ApiResponse<{ course: Course }>>(
        `/admin/courses/${id}/feature`
      );
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
      showSuccessMessage(`Course feature status: ${data.course.isFeatured ? "Featured" : "Unfeatured"}`);
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};
