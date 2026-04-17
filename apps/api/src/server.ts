import bodyParser from "body-parser";
import express, { type Express, type Request, type Response, type NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import errorHandler, { type Err } from "./middlewares/error";
import corsMiddleware from "./middlewares/cors";
import { log } from "@repo/logger";

import router from "./routes/index";

import appConfig from "./configs/app";
const port = appConfig.port;

log.info("Imported server");

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(cookieParser())
    .use(helmet())
    .use(corsMiddleware)
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    });

  app.use(router);
  app.use((err: Err, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
  });

  app.listen(port, () => {
    log.info(`API - Running on ${port}`);
  });
  return app;
};

createServer();
