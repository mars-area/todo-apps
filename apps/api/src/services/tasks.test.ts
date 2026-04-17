import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { TasksRepository } from "@/repositories/tasksRepository";
import { createTasksService } from "./tasks";

describe("createTasksService isolation", () => {
  const updateTaskForUser = jest.fn() as jest.MockedFunction<TasksRepository["updateTaskForUser"]>;
  const findById = jest.fn() as jest.MockedFunction<TasksRepository["findById"]>;
  const create = jest.fn() as jest.MockedFunction<TasksRepository["create"]>;
  const deleteFn = jest.fn() as jest.MockedFunction<TasksRepository["delete"]>;
  const findTasksByUserId = jest.fn() as jest.MockedFunction<TasksRepository["findTasksByUserId"]>;

  const tasksRepo = {
    updateTaskForUser,
    findById,
    create,
    delete: deleteFn,
    findTasksByUserId
  } as unknown as TasksRepository;

  const service = createTasksService({ tasksRepo });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updateTask calls updateTaskForUser with id and userId and omits userId from payload", async () => {
    updateTaskForUser.mockResolvedValue(true);
    findById.mockResolvedValue({ id: 1, title: "t" } as unknown as Awaited<ReturnType<TasksRepository["findById"]>>);

    await service.updateTask({
      id: 5,
      userId: 9,
      title: "Title",
      description: "Desc",
      dueDate: "2026-01-15T00:00:00.000Z",
      priority: "high",
      status: "pending"
    });

    expect(updateTaskForUser).toHaveBeenCalledWith(5, 9, {
      title: "Title",
      description: "Desc",
      dueDate: new Date("2026-01-15T00:00:00.000Z"),
      priority: "high",
      status: "pending"
    });
    expect(findById).toHaveBeenCalledWith(5);
  });

  it("updateTask returns null when updateTaskForUser affects no row", async () => {
    updateTaskForUser.mockResolvedValue(false);
    const result = await service.updateTask({
      id: 99,
      userId: 1,
      title: "a",
      description: "b",
      dueDate: "2026-01-01T00:00:00.000Z",
      priority: "low",
      status: "completed"
    });
    expect(result).toBeNull();
    expect(findById).not.toHaveBeenCalled();
  });

  it("deleteTask forwards id and userId to repository", async () => {
    deleteFn.mockResolvedValue(true);
    await service.deleteTask(3, 8);
    expect(deleteFn).toHaveBeenCalledWith(3, 8);
  });
});
