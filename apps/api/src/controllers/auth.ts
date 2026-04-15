import type { Request, Response } from "express";
import { authService, usersService } from "../services/index";
import { catchAsync, generateRandomHexString, type ControllerRequestType } from "../utils/helpers";
import { ErrorRes, SuccessRes } from "../utils/response";

export const emailSignIn = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await usersService.getUserDataByEmail(email);
  if (!user)
    return ErrorRes(res, {
      error: "UNAUTHORIZED",
      message: "Invalid email or password"
    });
  if (!user.password) {
    return ErrorRes(res, {
      error: "UNAUTHORIZED",
      message: "Password not set"
    });
  }

  const ok = authService.comparePassword(password, user.password);
  if (!ok)
    return ErrorRes(res, {
      error: "UNAUTHORIZED",
      message: "Invalid email or password"
    });


  const sessionData = {
    userId: user.id,
    token: generateRandomHexString(64)
  };

  await usersService.updateUserToken(user.id, sessionData.token);

  const payload = { userId: user.id };
  const accessToken = authService.signAccessToken(payload);
  const refreshToken = sessionData.token;

  return SuccessRes(res, {
    success: "OK",
    message: "Sign in successful",
    data: {
      name: user.name,
      email: user.email,
      token: {
        access: accessToken,
        refresh: refreshToken
      }
    }
  });
});

export const signOut = catchAsync(async (req: ControllerRequestType, res: Response) => {
  const refreshToken = req.headers["x-refresh-token"];
  if (!refreshToken)
    return ErrorRes(res, {
      error: "UNAUTHORIZED",
      message: "Missing refresh token"
    });

  return SuccessRes(res, {
    success: "OK",
    message: "Sign out successful"
  });
});

export const refreshToken = catchAsync(async (req: ControllerRequestType, res: Response) => {
  const token = req.headers["x-refresh-token"] as string;
  if (!token)
    return ErrorRes(res, {
      error: "UNAUTHORIZED",
      message: "Missing refresh token"
    });

  const refreshToken = await usersService.getUserToken(req.userId);
  if (!refreshToken)
    return ErrorRes(res, {
      error: "UNAUTHORIZED",
      message: "Invalid refresh token"
    });
  if (refreshToken !== token)
    return ErrorRes(res, {
      error: "UNAUTHORIZED",
      message: "Invalid refresh token"
    });

  const accessToken = authService.signAccessToken({ userId: req.userId });

  return SuccessRes(res, {
    success: "OK",
    message: "Refresh token successful",
    data: {
      token: { access: accessToken }
    }
  });
});

export default {
  emailSignIn,
  signOut,
  refreshToken
};