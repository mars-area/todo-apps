import { type ModelStatic } from "sequelize";
import { createBaseRepository, type BaseRepository } from "./baseRepository";
import { type TasksInstance } from "@/db/postgresql/models/tasks";

export interface TasksRepository extends BaseRepository<TasksInstance> {
  findTaskById: (id: string | number) => Promise<TasksInstance | null>;
  findTasksByUserId: (
    userId: number,
    query: { page: number; limit: number; offset: number; sort: string; order: string }
  ) => Promise<{ rows: TasksInstance[]; count: number }>;
}

export const createTasksRepository = (model: ModelStatic<TasksInstance>): TasksRepository => {
  const base = createBaseRepository(model);

  return {
    ...base,
    findTaskById: (id: string | number) =>
      model.scope("all").findOne({
        where: { id }
      }),
    findTasksByUserId: async (
      userId: number,
      query: { page: number; limit: number; offset: number; sort: string; order: string }
    ) => {
      const { limit, offset, sort, order } = query;
      const where: any = { userId };
      return await model.findAndCountAll({ where, limit, offset, order: [[sort as string, order as string]] });
    }
  };
};
