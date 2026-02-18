import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse } from "@/types/api.types";
import type { 
  Category, 
  SubCategory 
} from "@/types/courses/course.types";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";

/**
 * --- CATEGORY HOOKS ---
 */

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ categories: Category[] }>>("/categories");
      return data.data;
    },
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ category: Category }>>(`/categories/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Category>) => {
      const { data } = await api.post<ApiResponse<{ category: Category }>>("/categories", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      showSuccessMessage("Category created successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Category> & { id: string }) => {
      const { data } = await api.put<ApiResponse<{ category: Category }>>(`/categories/${id}`, payload);
      return data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", variables.id] });
      showSuccessMessage("Category updated successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      showSuccessMessage("Category deleted successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

/**
 * --- SUB-CATEGORY HOOKS ---
 */

export const useSubCategories = () => {
  return useQuery({
    queryKey: ["sub-categories"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ subCategories: SubCategory[] }>>("/sub-categories");
      return data.data;
    },
  });
};

export const useSubCategory = (id: string) => {
  return useQuery({
    queryKey: ["sub-categories", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ subCategory: SubCategory }>>(`/sub-categories/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useCreateSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<SubCategory>) => {
      const { data } = await api.post<ApiResponse<{ subCategory: SubCategory }>>("/sub-categories", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      showSuccessMessage("Sub-category created successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useUpdateSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<SubCategory> & { id: string }) => {
      const { data } = await api.put<ApiResponse<{ subCategory: SubCategory }>>(`/sub-categories/${id}`, payload);
      return data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
      queryClient.invalidateQueries({ queryKey: ["sub-categories", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      showSuccessMessage("Sub-category updated successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/sub-categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      showSuccessMessage("Sub-category deleted successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};
