import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse } from "@/types/api.types";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";

// Placeholder for course hooks if used in admin (usually they are under /courses but here they might be special)
export const useCourses = (params?: any) => {
  return useQuery({
    queryKey: ["admin-courses", params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<any>>("/courses", { params });
      return data.data;
    },
  });
};
