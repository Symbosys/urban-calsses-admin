import { useMutation } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse } from "@/types/api.types";
import type { 
  AuthResponse, 
  OtpResponse 
} from "@/types/user/user.types";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";

export const useSendOtp = () => {
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
    onSuccess: () => {
      showSuccessMessage("Logged in successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};
