import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import type { QueryInterface } from "sequelize";
import Sequelize from "sequelize";

dotenv.config();

const SEED_EMAIL = "user@test.com";

export default {
  async up(queryInterface: QueryInterface, SequelizeLib: typeof Sequelize) {
    const salt = process.env.SALT || "salt";
    const password = bcrypt.hashSync("password" + salt, 10);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Ghani",
          email: SEED_EMAIL,
          password
        }
      ],
      {}
    );

    const rows = (await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = :email LIMIT 1`,
      { replacements: { email: SEED_EMAIL }, type: SequelizeLib.QueryTypes.SELECT }
    )) as { id: number }[];
    const userId = rows[0]!.id;

    const base = Date.now();
    await queryInterface.bulkInsert(
      "tasks",
      [
        {
          title: "Gambar Teknik",
          description: "Membuat sketsa jalur kelistrikan dalam gedung lantai 4 untuk proyek pengembangan gedung",
          user_id: userId,
          due_date: new Date(base + 2 * 24 * 60 * 60 * 1000),
          priority: "high",
          status: "in_progress"
        },
        {
          title: "Praktikum Rangkaian Listrik",
          description: "Mengerjakan modul praktikum rangkaian listrik",
          user_id: userId,
          due_date: new Date(base + 5 * 24 * 60 * 60 * 1000),
          priority: "medium",
          status: "pending"
        },
        {
          title: "Tugas Akhir Konversi Energi Listrik",
          description: "Mengerjakan tugas akhir konversi energi listrik, menggunakan software matlab",
          user_id: userId,
          due_date: new Date(base + 7 * 24 * 60 * 60 * 1000),
          priority: "medium",
          status: "pending"
        },
        {
          title: "Follow Up Client",
          description: "Follow up client untuk mengecek progress proyek",
          user_id: userId,
          due_date: new Date(base + 10 * 24 * 60 * 60 * 1000),
          priority: "low",
          status: "pending"
        }
      ],
      {}
    );
  },

  async down(queryInterface: QueryInterface, SequelizeLib: typeof Sequelize) {
    const rows = (await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = :email LIMIT 1`,
      { replacements: { email: SEED_EMAIL }, type: SequelizeLib.QueryTypes.SELECT }
    )) as { id: number }[];
    if (!rows.length) return;
    const userId = rows[0]!.id;

    await queryInterface.bulkDelete("tasks", { user_id: userId }, {});
    await queryInterface.bulkDelete("users", { email: SEED_EMAIL }, {});
  }
};
