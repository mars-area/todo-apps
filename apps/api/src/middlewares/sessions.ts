import type { Response, NextFunction } from "express";

import { type ControllerRequestType, catchAsync } from "../utils/helpers";
import { ErrorRes } from "../utils/response";
import { authService } from "../services/index";

export const session = catchAsync(async (req: ControllerRequestType, res: Response, next?: NextFunction) => {
  const accessToken = req.headers["x-access-token"] as string;
  const refreshToken = req.headers["x-refresh-token"] as string;

  if (!accessToken && !refreshToken) {
    return ErrorRes(res, { error: "UNAUTHORIZED", message: "Missing token." });
  }

  if (!accessToken) {
    return ErrorRes(res, { error: "UNAUTHORIZED", message: "Access token expired." });
  }

  const decoded = authService.verifyAccessToken(accessToken) as { id: number; userId: number } | null;
  if (!decoded) {
    return ErrorRes(res, { error: "UNAUTHORIZED", message: "Access token expired." });
  }
  if (!decoded.userId) {
    return ErrorRes(res, { error: "UNAUTHORIZED", message: "Unauthorized." });
  }

  // if (!session) {
  //   return ErrorRes(res, { error: "SESSION_EXPIRED", message: "Session expired." });
  // }
  // if (session.token !== refreshToken) {
  //   return ErrorRes(res, { error: "SESSION_EXPIRED", message: "Session expired." });
  // }

  req.userId = decoded.userId;
  if (next) next();
});
