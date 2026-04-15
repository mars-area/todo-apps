import { type ModelStatic } from "sequelize";
import { createBaseRepository, type BaseRepository } from "./baseRepository";
import { type UsersInstance } from "../db/postgresql/models/users";

export interface UsersRepository extends BaseRepository<UsersInstance> {
  findUserByEmail: (id: string | number) => Promise<UsersInstance | null>;
  findUserDetails: (id: number) => Promise<UsersInstance | null>;
}

export const createUsersRepository = (model: ModelStatic<UsersInstance>): UsersRepository => {
  const base = createBaseRepository(model);

  return {
    ...base,
    findUserByEmail: (email: string | number) =>
      model.scope("all").findOne({
        where: { email }
      }),
    findUserDetails: (id: number) =>
      model.scope("all").findOne({
        where: { id },
        attributes: { exclude: ["password", "token"] },
      }),
  };
};
