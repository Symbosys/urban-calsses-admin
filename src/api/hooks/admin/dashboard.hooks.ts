import { useQuery } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse } from "@/types/api.types";
import type { DashboardData } from "@/types/admin/dashboard.types";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<DashboardData>>("/admin/dashboard/stats");
      return data.data;
    },
  });
};
