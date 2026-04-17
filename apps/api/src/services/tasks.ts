import { type TasksRepository } from "@/repositories/tasksRepository";

export interface TasksServiceDeps {
  tasksRepo: TasksRepository;
}

export const createTasksService = ({ tasksRepo }: TasksServiceDeps) => {
  return {
    createTask: async (task: { title: string; description: string; dueDate: string; priority: string; status: string; userId: number }) => {
      return await tasksRepo.create({
        title: task.title,
        description: task.description,
        dueDate: new Date(task.dueDate),
        priority: task.priority,
        status: task.status,
        userId: task.userId,
      });
    },
    updateTask: async (task: { id: number; title: string; description: string; dueDate: string; priority: string; status: string; userId: number }) => {
      const ok = await tasksRepo.updateTaskForUser(task.id, task.userId, {
        title: task.title,
        description: task.description,
        dueDate: new Date(task.dueDate),
        priority: task.priority,
        status: task.status,
      });
      if (!ok) return null;
      return await tasksRepo.findById(task.id);
    },
    deleteTask: async (id: number, userId: number) => {
      return await tasksRepo.delete(id, userId);
    },
    getTasks: async (userId: number, query: { page: number; limit: number; offset: number; sort: string; order: string }) => {
      return await tasksRepo.findTasksByUserId(userId, query);
    },
  };
};