"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface: any, Sequelize: any) {
  await queryInterface.createTable("tasks", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER(11)
    },
    title: {
      allowNull: false,
      type: Sequelize.STRING(50)
    },
    description: {
      allowNull: false,
      type: Sequelize.TEXT
    },
    completed: {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN
    },
    userId: {
      allowNull: false,
      type: Sequelize.INTEGER(11),
      references: {
        model: "users",
        key: "id"
      }
    },
    dueDate: {
      allowNull: false,
      type: Sequelize.DATE
    },
    priority: {
      allowNull: false,
      defaultValue: "medium",
      type: Sequelize.ENUM("low", "medium", "high")
    },
    status: {
      allowNull: false,
      defaultValue: "pending",
      type: Sequelize.ENUM("pending", "in_progress", "completed")
    },
    createdAt: {
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      field: "created_at",
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      field: "updated_at",
      type: Sequelize.DATE
    },
    deletedAt: {
      defaultValue: null,
      field: "deleted_at",
      type: Sequelize.DATE
    }
  });
}

export async function down(queryInterface: any, _Sequelize: any) {
  await queryInterface.dropTable("tasks")
}
