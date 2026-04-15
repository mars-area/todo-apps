import { createTaskApi, deleteTaskApi, getTaskDetailApi, getTasksApi, updateTaskApi } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IQueryParams, ITaskCreateData, ITaskUpdateData } from "@/types";

export const useTaskCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ITaskCreateData) => {
      const { callback, ...body } = data;
      void callback;
      return createTaskApi(body);
    },
    onSuccess: (_, props) => {
      const { callback } = props;
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      if (callback) callback();
    }
  });
};

export const useTaskUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ITaskUpdateData) => {
      const { callback, ...body } = data;
      void callback;
      return updateTaskApi(body);
    },
    onSuccess: (response, props) => {
      const { callback } = props;
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      const id = response.data?.data?.id;
      if (typeof id === "number") {
        queryClient.invalidateQueries({ queryKey: ["tasks", id] });
      }
      if (callback) callback();
    }
  });
};

export const useTaskDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number; callback?: () => void }) => deleteTaskApi(id),
    onSuccess: (_response, props) => {
      const { callback } = props;
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      if (callback) callback();
    }
  });
};  

export const useTaskGet = (params: IQueryParams) => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasksApi(params)
  });
};  

export const useTaskGetDetail = (id: number) => {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => getTaskDetailApi(id)
  });
};