import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse, Pagination } from "@/types/api.types";
import type { 
  Course, 
  CourseFilters, 
  CreateCourseInput, 
  UpdateCourseInput 
} from "@/types/courses/course.types";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";

export const useCourses = (params: CourseFilters = {}) => {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ courses: Course[]; pagination: Pagination }>>(
        "/courses",
        { params }
      );
      return data.data;
    },
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ["courses", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ course: Course }>>(`/courses/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useCourseBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["courses", "slug", slug],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ course: Course }>>(`/courses/slug/${slug}`);
      return data.data;
    },
    enabled: !!slug,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateCourseInput) => {
      const { data } = await api.post<ApiResponse<{ course: Course }>>("/courses", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      showSuccessMessage("Course created successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateCourseInput & { id: string }) => {
      const { data } = await api.put<ApiResponse<{ course: Course }>>(`/courses/${id}`, payload);
      return data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses", variables.id] });
      if (data.course.slug) {
        queryClient.invalidateQueries({ queryKey: ["courses", "slug", data.course.slug] });
      }
      showSuccessMessage("Course updated successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/courses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      showSuccessMessage("Course deleted successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};
