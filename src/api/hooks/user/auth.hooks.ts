import { useMutation } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse } from "@/types/api.types";
import type { 
  AuthResponse, 
  OtpResponse 
} from "@/types/user/user.types";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";
import { useAuthStore } from "@/store/authStore";

export const useSendOtp = () => {
// ... (omitting unchanged code for simplicity but will provide full target)
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await api.post<ApiResponse<OtpResponse>>("/user/auth/send-otp", { email });
      return data.data;
    },
    onSuccess: () => {
      showSuccessMessage("OTP sent to your email");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async (payload: { email: string; otp: string }) => {
      const { data } = await api.post<ApiResponse<AuthResponse>>("/user/auth/verify-otp", payload);
      return data.data;
    },
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(data.user, data.token);
      showSuccessMessage("Logged in successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post<ApiResponse<AuthResponse>>("/admin/auth/login", payload);
      return data.data;
    },
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(data.user, data.token);
      showSuccessMessage("Admin logged in successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};
