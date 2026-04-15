import { Sequelize, DataTypes, Model, type Optional, type ModelStatic } from "sequelize";

export interface UsersAttributes {
  id: number;
  name: string;
  email: string;
  password: string | null;
  token: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type UsersCreationAttributes = Optional<
  UsersAttributes,
  | "id"
  | "token"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
>;

export type UsersInstance = Model<UsersAttributes, UsersCreationAttributes>;

export interface UsersModel extends ModelStatic<UsersInstance> {
  associate?: (models: { [key: string]: ModelStatic<Model<object, object>> }) => void;
}

const UsersModel = (sequelize: Sequelize) => {
  const Users = sequelize.define<UsersInstance>(
    "Users",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(50)
      },
      email: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING(50)
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(100)
      },
      token: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.STRING(100)
      },
      createdAt: {
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at",
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "updated_at",
        type: DataTypes.DATE
      },
      deletedAt: {
        defaultValue: null,
        field: "deleted_at",
        type: DataTypes.DATE
      }
    },
    {
      tableName: "users",
      timestamps: true,
      defaultScope: {
        where: {
          deletedAt: null
        },
        attributes: { exclude: ["password", "deletedAt"] }
      },
      scopes: {
        all: {
          attributes: { exclude: ["deletedAt"] }
        },
      },
      paranoid: true
    }
  );

  // (Users as unknown as UsersModel).associate = (models: { [key: string]: ModelStatic<Model> }) => {
  //   Users.hasMany(models.Balances as ModelStatic<Model<object, object>>, { foreignKey: "userId", as: "balances" });
  // };

  return Users;
};

export default UsersModel;
