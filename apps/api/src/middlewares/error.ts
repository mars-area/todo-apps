import type { NextFunction, Request, Response } from "express";
import { ErrorRes } from "../utils/response";
import { log } from "@repo/logger";

export interface Err {
  statusCode: number;
  message: string;
  stack: string;
  type: string;
}

function errorHandler(err: Err, req: Request, res: Response, _next: NextFunction) {
  // body-parser error
  if (err.type === "entity.parse.failed") {
    return ErrorRes(res, { error: "BAD_REQUEST", message: "The request is not in a valid JSON format." });
  }

  log.error("", err, req);

  return ErrorRes(res, { error: "INTERNAL_SERVER_ERROR", message: "Service unavailable." });
}

export default errorHandler;
