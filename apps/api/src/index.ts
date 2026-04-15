import type { Express } from "express";

import { log } from "@repo/logger";

import { connectToPostgreSQL } from "./db/postgresql/connection";
import { initModels } from "./db/postgresql/models/loader";

initModels();

(async () => {
  try {
    await connectToPostgreSQL();
    await import("./server") as unknown as Express;
  } catch (error) {
    log.error(error);
  }
})();
