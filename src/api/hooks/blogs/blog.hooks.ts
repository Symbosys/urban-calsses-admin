import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse } from "../../../types/api.types";
import type {
  Blog,
  BlogFilters,
  CreateBlogInput,
  UpdateBlogInput
} from "../../../types/blogs/blog.types";
import { showErrorMessage, showSuccessMessage } from "../../../utils/message";

export const useBlogs = (params: BlogFilters = {}) => {
  return useQuery({
    queryKey: ["blogs", params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ blogs: Blog[] }>>(
        "/blogs",
        { params }
      );
      return data.data;
    },
  });
};

export const useBlog = (id: string) => {
  return useQuery({
    queryKey: ["blogs", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ blog: Blog }>>(`/blogs/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateBlogInput) => {
      const { data } = await api.post<ApiResponse<{ blog: Blog }>>("/blogs", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      showSuccessMessage("Blog created successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateBlogInput) => {
      const { data } = await api.patch<ApiResponse<{ blog: Blog }>>(`/blogs/${id}`, payload);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs", variables.id] });
      showSuccessMessage("Blog updated successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/blogs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      showSuccessMessage("Blog deleted successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};
