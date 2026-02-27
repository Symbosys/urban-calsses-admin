import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse } from "@/types/api.types";
import type { 
  Banner, 
  CreateBannerInput, 
  UpdateBannerInput 
} from "@/types/admin/banner.types";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";

export const useBanners = () => {
  return useQuery({
    queryKey: ["admin", "banners"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ banners: Banner[] }>>("/admin/banners");
      return data.data;
    },
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateBannerInput) => {
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
      const { data } = await api.post<ApiResponse<{ banner: Banner }>>("/admin/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "banners"] });
      showSuccessMessage("Banner created successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateBannerInput & { id: string }) => {
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
      const { data } = await api.patch<ApiResponse<{ banner: Banner }>>(`/admin/banners/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "banners"] });
      showSuccessMessage("Banner updated successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/banners/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "banners"] });
      showSuccessMessage("Banner deleted successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};
