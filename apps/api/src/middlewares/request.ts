import type { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/helpers";
import { ErrorRes } from "../utils/response";
import config from "../configs/app";

const validate = (validation: string | { [key: string]: any }, env?: string) => {
  return catchAsync(async (req: Request, res: Response, next?: NextFunction) => {
    if (env && env !== config.env) {
      return ErrorRes(res, { error: "BAD_REQUEST", message: `This feature only for ${env}.` });
    }

    const request: { [key: string]: any } = {
      body: req.body,
      query: req.query,
      params: req.params,
      files: req.files,
      file: req.file
    };

    if (req.body && Object.keys(req.body).length === 0) {
      return ErrorRes(res, { error: "BAD_REQUEST", message: "Invalid request body." });
    }

    if (validation === "authHeader") {
      const validationKeys = ["x-device-id", "x-device-platform", "x-device-type"];
      for (const validationKey of validationKeys) {
        const value = req.headers[validationKey];
        if (!value) {
          return ErrorRes(res, { error: "BAD_REQUEST", message: "Missing required headers" });
        }
      }
    } else {
      try {
        // loop validation keys and validate each key
        for (const validationKey in validation as { [key: string]: any }) {
          const schema = (validation as { [key: string]: any })[validationKey];
          const value = request[validationKey];
          if (schema !== undefined) {
            if (value === undefined) {
              return ErrorRes(res, { error: "BAD_REQUEST", message: `Missing ${validationKey}.` });
            }
            await schema.validateAsync(value);
          }
        }
      } catch (error) {
        return ErrorRes(res, { error: "BAD_REQUEST", message: (error as Error).message });
      }
    }

    if (next) next();
  });
};

export default validate;
