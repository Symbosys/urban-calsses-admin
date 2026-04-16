import { useQuery } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse } from "@/types/api.types";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<any>>("/admin/dashboard/stats");
      return data.data;
    },
  });
};
