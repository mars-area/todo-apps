import fs from "fs";
import path from "path";
import { Model, type ModelStatic } from "sequelize";
import { log } from "@repo/logger";

import sequelize from "../connection";

if (!sequelize) throw new Error("Sequelize not initialized");
log.info("Imported model loader");

/**
 * Define a type that extends the standard Sequelize ModelStatic
 * to include the optional associate method used in your architecture.
 */
export type SequelizeModel = ModelStatic<Model> & {
  associate?: (models: Record<string, SequelizeModel>) => void;
};

const NOT_LOADED_FILES: string[] = ["loader.ts", "loader.js"];

// Use the custom SequelizeModel type for the db object
const db: Record<string, SequelizeModel> = {};

export const initModels = async () => {
  try {
    const fileNames: string[] = [];
    log.info("Loading PostgreSQL models...");

    const files = fs.readdirSync(path.join(__dirname, "./"));

    files.forEach(file => {
      if (
        (file.endsWith(".ts") || file.endsWith(".js")) &&
        file.split(".").length === 2 &&
        !NOT_LOADED_FILES.includes(file)
      ) {
        fileNames.push(file);
      }
    });

    // Load models
    for (const file of fileNames) {
      try {
        const module = await import(`./${file}`); // Wait for the import
        const modelInstance: SequelizeModel = module.default(sequelize);

        db[modelInstance.name] = modelInstance;
        log.info(`Loaded model: ${modelInstance.name}`);
      } catch (error) {
        log.error(`Unable to load model ${file}:`, error);
      }
    }

    // Associate models
    // We can now iterate through the values without 'any'
    Object.values(db).forEach(model => {
      try {
        if (typeof model.associate === "function") {
          model.associate(db);
          log.info(`Associated model: ${model.name}`);
        }
      } catch (error) {
        log.error(`Unable to associate model ${model.name}:`, error);
      }
    });

    log.info("PostgreSQL models loaded successfully");
  } catch (error) {
    log.error("Unable to connect to the PostgreSQL database:", error);
  }
};

export default db;
