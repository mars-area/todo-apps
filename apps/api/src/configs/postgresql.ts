import dotenv from "dotenv";

dotenv.config();

const CONFIG = {
  db_server: process.env.DB_SERVER || "localhost",
  db_port: process.env.DB_PORT || 5432,
  db_name: process.env.DB_NAME || "todo_db",
  db_user: process.env.DB_USER || "root",
  db_pass: process.env.DB_PASS || ""
};

const defaultConfig = {
  username: CONFIG.db_user,
  password: CONFIG.db_pass,
  database: CONFIG.db_name,
  host: CONFIG.db_server,
  port: Number(CONFIG.db_port),
  dialect: "postgresql",
  logging: console.log
};

const dbConfigList = {
  local: {
    ...defaultConfig
  },
  test: {
    ...defaultConfig
  },
  development: {
    ...defaultConfig
  },
  production: {
    ...defaultConfig,
    logging: false
  }
};

export default dbConfigList;
