import { type Model, type ModelStatic, type Attributes, type CreationAttributes, type FindOptions } from "sequelize";

export interface BaseRepository<T extends Model> {
  findById: (id: string | number, options?: FindOptions<Attributes<T>>) => Promise<T | null>;
  findOne: (options?: FindOptions<Attributes<T>>) => Promise<T | null>;
  findAll: (options?: FindOptions<Attributes<T>>) => Promise<T[]>;
  create: (data: CreationAttributes<T>) => Promise<T>;
  update: (id: string | number, data: Partial<Attributes<T>>) => Promise<boolean>;
  delete: (id: string | number, userId: number) => Promise<boolean>;
}

export const createBaseRepository = <T extends Model>(model: ModelStatic<T>): BaseRepository<T> => ({
  findById: async (id, options) => await model.findByPk(id, options),

  findOne: async options => await model.findOne(options),

  findAll: async options => await model.findAll(options),

  create: async data => await model.create(data),

  update: async (id, data) => {
    const [affectedCount] = await model.update(data, { where: { id } as any });
    return affectedCount > 0;
  },

  delete: async (id, userId) => {
    const affectedCount = await model.update({ deletedAt: new Date() }, { where: { id, userId } as any });
    return affectedCount[0] > 0;
  }
});
