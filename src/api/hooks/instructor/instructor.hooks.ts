import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import type { ApiResponse, Pagination } from "@/types/api.types";
import type { 
  Instructor, 
  InstructorFilters, 
  CreateInstructorInput, 
  UpdateInstructorInput 
} from "@/types/instructor/instructor.types";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";

export const useInstructors = (params: InstructorFilters = {}) => {
  return useQuery({
    queryKey: ["instructors", params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ instructors: Instructor[]; pagination: Pagination }>>(
        "/instructors",
        { params }
      );
      return data.data;
    },
  });
};

export const useInstructor = (id: string) => {
  return useQuery({
    queryKey: ["instructors", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ instructor: Instructor }>>(`/instructors/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useCreateInstructor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateInstructorInput) => {
      const { data } = await api.post<ApiResponse<{ instructor: Instructor }>>("/instructors", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructors"] });
      showSuccessMessage("Instructor created successfully");
    },
    onError: (error) => {
      showErrorMessage(error);
    },
  });
};

export const useUpdateInstructor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateInstructorInput & { id: string }) => {
      const { data } = await api.put<ApiResponse<{ instructor: Instructor }>>(`/instructors/${id}`, payload);
      return data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["instructors"] });
      queryClient.invalidateQueries({ queryKey: ["instructors", variables.id] });
      showSuccessMessage("Instructor updated successfully");
    },
    onError: (error) => {
      showErrorMessage(error);
    },
  });
};

export const useDeleteInstructor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/instructors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructors"] });
      showSuccessMessage("Instructor deleted successfully");
    },
    onError: (error) => {
      showErrorMessage(error);
    },
  });
};
