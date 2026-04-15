import { col, fn, literal, Op, type Attributes, type FindOptions, type ModelStatic } from "sequelize";
import { createBaseRepository, type BaseRepository } from "./baseRepository";
import { type UsersInstance } from "../db/postgresql/models/users";

export interface UsersRepository extends BaseRepository<UsersInstance> {
  findUserByEmail: (id: string | number) => Promise<UsersInstance | null>;
  findAndCountAllUser: (options?: FindOptions<Attributes<UsersInstance>>) => Promise<{
    rows: UsersInstance[];
    count: number;
  }>;
  findUserDetails: (uid: string) => Promise<UsersInstance | null>;
  findPaginatedUsersWithBalances: (params: {
    limit: number;
    offset: number;
    order: [string, string][];
    search?: string;
    type?: string;
  }) => Promise<{ rows: UsersInstance[]; count: number }>;
  countUsersByDateGroup: (filters: {
    startDate?: Date;
    endDate?: Date;
  }) => Promise<Array<{ date: string; count: number }>>;
  countAllUsers: () => Promise<number>;
}

export const createUsersRepository = (model: ModelStatic<UsersInstance>): UsersRepository => {
  const base = createBaseRepository(model);

  return {
    ...base,
    countAllUsers: async () => {
      return await model.scope("all").count();
    },
    countUsersByDateGroup: async ({ startDate, endDate }) => {
      const where: any = {};

      if (startDate && endDate) {
        where.createdAt = { [Op.between]: [startDate, endDate] };
      } else if (startDate) {
        where.createdAt = { [Op.gte]: startDate };
      } else if (endDate) {
        where.createdAt = { [Op.lte]: endDate };
      }

      const results = await model.scope("all").findAll({
        where,
        attributes: [
          [fn("DATE", col("created_at")), "date"],
          [fn("COUNT", literal("*")), "count"]
        ],
        group: [fn("DATE", col("created_at"))],
        order: [[fn("DATE", col("created_at")), "ASC"]],
        raw: true // Return plain objects for easier mapping
      });

      // Map Sequelize results to a standard format
      return results.map((item: any) => ({
        date: item.date as string,
        count: parseInt(item.count) || 0
      }));
    },
    findUserByEmail: (email: string | number) =>
      model.scope("all").findOne({
        where: { email }
      }),
    findAndCountAllUser: (options?: FindOptions<Attributes<UsersInstance>>) =>
      model.scope("all").findAndCountAll(options),
    findUserDetails: (uid: string) =>
      model.scope("all").findOne({
        where: { uid },
        attributes: { exclude: ["password", "bankPin"] },
        include: [
          {
            association: "balances",
            attributes: ["currentBalance", "ticker"],
            required: false
          },
          {
            association: "balanceEarnings",
            attributes: ["currentBalance", "ticker"],
            required: false
          }
        ]
      }),
    findPaginatedUsersWithBalances: async ({
      limit,
      offset,
      order,
      search,
      type
    }: {
      limit: number;
      offset: number;
      order: any;
      search?: string;
      type?: string;
    }) => {
      const where: any = {};
      if (search) {
        where[Op.or] = [
          { gameId: { [Op.like]: `%${search}%` } },
          { username: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ];
      }
      if (type && type !== "all") {
        where.type = type;
      }
      return await model.scope("all").findAndCountAll({
        limit,
        offset,
        where,
        order: order as any,
        attributes: ["id", "uid", "gameId", "username", "email", "gameId", "status", "type", "createdAt"],
        include: [
          {
            association: "balances",
            attributes: ["currentBalance", "ticker"],
            required: false
          },
          {
            association: "balanceEarnings",
            attributes: ["currentBalance", "ticker"],
            required: false
          }
        ]
      });
    }
  };
};
