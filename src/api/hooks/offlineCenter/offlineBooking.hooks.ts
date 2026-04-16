import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse } from "../../../types/api.types";
import type { 
  OfflineBooking, 
  UpdateOfflineBookingStatusInput 
} from "../../../types/offlineCenter/offlineBooking.types";
import { showErrorMessage, showSuccessMessage } from "../../../utils/message";

export const useOfflineBookings = () => {
  return useQuery({
    queryKey: ["offline-bookings"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ bookings: OfflineBooking[] }>>(
        "/offline-bookings"
      );
      return data.data;
    },
  });
};

export const useUpdateOfflineBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: UpdateOfflineBookingStatusInput) => {
      const { data } = await api.patch<ApiResponse<{ booking: OfflineBooking }>>(
        `/offline-bookings/${id}/status`,
        { status }
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offline-bookings"] });
      showSuccessMessage("Booking status updated successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};

export const useDeleteOfflineBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/offline-bookings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offline-bookings"] });
      showSuccessMessage("Booking deleted successfully");
    },
    onError: (error: any) => {
      showErrorMessage(error);
    },
  });
};
