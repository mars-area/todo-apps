"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface: any, Sequelize: any) {
  await queryInterface.createTable("users", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER(11)
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING(50)
    },
    email: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING(50)
    },
    password: {
      allowNull: false,
      type: Sequelize.STRING(100)
    },
    token: {
      allowNull: true,
      defaultValue: null,
      type: Sequelize.STRING(100)
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
  await queryInterface.dropTable("users")
}
