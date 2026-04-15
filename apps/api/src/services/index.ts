import db from "../db/postgresql/models/loader";
import { type UsersModel } from "@/db/postgresql/models/users";
import { type TasksModel } from "@/db/postgresql/models/tasks";

import { createAuthService } from "./auth";
import { createUsersService } from "./users";
import { createTasksService } from "./tasks";

import { createUsersRepository } from "@/repositories/usersRepository";
import { createTasksRepository } from "@/repositories/tasksRepository";

const usersRepo = createUsersRepository(db.Users as UsersModel);
const tasksRepo = createTasksRepository(db.Tasks as TasksModel);

export const authService = createAuthService();
export const usersService = createUsersService({ usersRepo });
export const tasksService = createTasksService({ tasksRepo });