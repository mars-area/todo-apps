import db from "../db/postgresql/models/loader";
import { type UsersModel } from "../db/postgresql/models/users";

import { createAuthService } from "./auth";
import { createUsersService } from "./users";

import { createUsersRepository } from "../repositories/usersRepository";

const usersRepo = createUsersRepository(db.Users as UsersModel);

export const authService = createAuthService();
export const usersService = createUsersService({ usersRepo });
