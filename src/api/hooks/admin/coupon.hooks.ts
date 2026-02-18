import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse } from "@/types/api.types";
import type { 
  Coupon, 
  CreateCouponInput, 
  UpdateCouponInput 
} from "@/types/admin/coupon.types";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";

export const useCoupons = () => {
  return useQuery({
    queryKey: ["admin", "coupons"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ coupons: Coupon[] }>>("/admin/coupons");
      return data.data;
    },
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateCouponInput) => {
      const { data } = await api.post<ApiResponse<{ coupon: Coupon }>>("/admin/coupons", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      showSuccessMessage("Coupon created successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateCouponInput & { id: string }) => {
      const { data } = await api.patch<ApiResponse<{ coupon: Coupon }>>(`/admin/coupons/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      showSuccessMessage("Coupon updated successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/coupons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      showSuccessMessage("Coupon deleted successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};
