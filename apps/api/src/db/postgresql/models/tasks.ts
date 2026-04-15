import { Sequelize, DataTypes, Model, type Optional, type ModelStatic } from "sequelize";

export interface TasksAttributes {
  id: number;
  title: string;
  description: string;
  userId: number;
  dueDate: Date;
  priority: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type TasksCreationAttributes = Optional<
  TasksAttributes,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
>;

export type TasksInstance = Model<TasksAttributes, TasksCreationAttributes>;

export interface TasksModel extends ModelStatic<TasksInstance> {
  associate?: (models: { [key: string]: ModelStatic<Model<object, object>> }) => void;
}

const TasksModel = (sequelize: Sequelize) => {
  const Tasks = sequelize.define<TasksInstance>(
    "Tasks",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING(50)
      },
      description: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      userId: {
        allowNull: false,
        field: "user_id",
        type: DataTypes.INTEGER
      },
      dueDate: {
        allowNull: false,
        field: "due_date",
        type: DataTypes.DATE
      },
      priority: {
        allowNull: false,
        defaultValue: "medium",
        type: DataTypes.ENUM("low", "medium", "high")
      },
      status: {
        allowNull: false,
        defaultValue: "pending",
        type: DataTypes.ENUM("pending", "in_progress", "completed")
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
      tableName: "tasks",
      timestamps: true,
      defaultScope: {
        where: {
          deletedAt: null
        },
        attributes: { exclude: ["deletedAt"] }
      },
      paranoid: true
    }
  );

  (Tasks as unknown as TasksModel).associate = (models: { [key: string]: ModelStatic<Model> }) => {
    Tasks.belongsTo(models.Users as ModelStatic<Model<object, object>>, { foreignKey: "userId", as: "user" });
  };

  return Tasks;
};

export default TasksModel;
