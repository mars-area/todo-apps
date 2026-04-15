import { type Dialect, Sequelize } from "sequelize";
import { log } from "@repo/logger";

import appConfig from "../../configs/app";
import dbConfigList from "../../configs/postgresql";
import { delay } from "../../utils/helpers";

const databaseConfig = dbConfigList[appConfig.env as keyof typeof dbConfigList];

log.info("Imported PostgreSQL Connection");

let sequelize: Sequelize | null = null;
if (sequelize === null) {
  sequelize = new Sequelize(databaseConfig.database, databaseConfig.username, databaseConfig.password, {
    host: databaseConfig.host,
    port: databaseConfig.port,
    dialect: databaseConfig.dialect as Dialect,
    logging: databaseConfig.logging
  });
}

let retries = 5;

export async function connectToPostgreSQL() {
  while (retries > 0) {
    log.info("Connecting to PostgreSQL database...");
    try {
      sequelize?.authenticate().then(() => {
        log.info("Connection to PostgreSQL database has been established successfully.");
      });
      break;
    } catch (err) {
      retries -= 1;
      log.info(`Retries left: ${retries}. Trying again in 5 seconds...`);
      if (retries === 0) {
        log.error("Unable to connect to the PostgreSQL database:", err);
      }
    }
    await delay(5000);
  }
}

export default sequelize;
