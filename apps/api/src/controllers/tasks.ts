import type { Response } from "express";
import { catchAsync, type ControllerRequestType } from "@/utils/helpers";
import { ErrorRes, SuccessRes } from "@/utils/response";
import { tasksService } from "@/services/index";
import { useQuery } from "@/utils/pagination";

export const createTask = catchAsync(async (req: ControllerRequestType, res: Response) => {
  const { title, description, dueDate, priority, status } = req.body;
  const userId = req.userId as number;
  const task = await tasksService.createTask({ title, description, dueDate, priority, status, userId });
  return SuccessRes(res, {
    success: "OK",
    message: "Task created successfully",
    data: task
  });
});

export const updateTask = catchAsync(async (req: ControllerRequestType, res: Response) => {
  const { id } = req.params;
  const { title, description, dueDate, priority, status } = req.body;
  const userId = req.userId as number;
  const task = await tasksService.updateTask({ id: Number(id), title, description, dueDate, priority, status, userId });
  if (!task) {
    return ErrorRes(res, {
      error: "NOT_FOUND",
      message: "Task not found"
    });
  }
  return SuccessRes(res, {
    success: "OK",
    message: "Task updated successfully",
    data: task
  });
});

export const deleteTask = catchAsync(async (req: ControllerRequestType, res: Response) => {
  const { id } = req.params;
  const userId = req.userId as number;
  const task = await tasksService.deleteTask(Number(id), userId);
  if (!task) {
    return ErrorRes(res, {
      error: "NOT_FOUND",
      message: "Task not found"
    });
  }
  return SuccessRes(res, {
    success: "OK",
    message: "Task deleted successfully",
  });
});

export const getTasks = catchAsync(async (req: ControllerRequestType, res: Response) => {
  const userId = req.userId;
  const { page, limit, offset, sort, order } = useQuery(req);
  const { rows, count } = await tasksService.getTasks(userId as number, { page, limit, offset, sort, order });

  const totalPage = Math.ceil(count / limit);
  const meta = { total: count, page, totalPage, limit };

  return SuccessRes(res, {
    success: "OK",
    message: "Tasks retrieved successfully",
    data: rows,
    meta
  });
});

export default {
  createTask,
  updateTask,
  deleteTask,
  getTasks
};