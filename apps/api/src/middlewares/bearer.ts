import type { NextFunction, Request, Response } from "express";
import config from "../configs/app";
import { catchAsync } from "../utils/helpers";
import { ErrorRes } from "../utils/response";

const getRequestIp = (req: Request) => {
  const ip = req.headers["x-forwarded-for"] ?? req.socket.remoteAddress;
  return typeof ip === "string" ? ip.split(",")[0] : "";
};

interface BearerRequest extends Request {
  ipAddress?: string;
}

const bearer = catchAsync(async (req: BearerRequest, res: Response, next: NextFunction | undefined) => {
  const bearerHeader = req.headers.authorization as string | undefined;
  const bearerToken = bearerHeader ? bearerHeader.split(" ")[1] : "";

  if (!bearerToken) {
    return ErrorRes(res, { error: "UNAUTHORIZED", message: "Missing required headers." });
  }

  if (bearerToken !== config.bearer_token) {
    return ErrorRes(res, { error: "UNAUTHORIZED", message: "Invalid token." });
  }

  // valid ip
  const ipAddress = getRequestIp(req);
  if (!ipAddress) {
    return ErrorRes(res, { error: "UNAUTHORIZED", message: "Invalid IP address." });
  }
  req.ipAddress = ipAddress;

  if (next) next();
});

export default bearer;
