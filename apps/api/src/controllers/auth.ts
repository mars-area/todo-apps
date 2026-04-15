import type { Request, Response } from "express";
import { authService, usersService } from "../services/index";
import { catchAsync, generateRandomHexString, type ControllerRequestType } from "../utils/helpers";
import { ErrorRes, SuccessRes } from "../utils/response";

export const emailSignUp = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const user = await usersService.getUserDataByEmail(email);
  if (user) {
    return ErrorRes(res, {
      error: "BAD_REQUEST",
      message: "Email already in use"
    });
  }

  const newUser = await usersService.createUser({ name, email, password });

  return SuccessRes(res, {
    success: "OK",
    message: "Sign up successful",
    data: {
      name: newUser.name,
      email: newUser.email,
    }
  });
})

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

  const user = await usersService.getUserByToken(token);
  if (!user)
    return ErrorRes(res, {
      error: "UNAUTHORIZED",
      message: "Invalid refresh token"
    });

  const accessToken = authService.signAccessToken({ userId: user.id });

  return SuccessRes(res, {
    success: "OK",
    message: "Refresh token successful",
    data: {
      token: { access: accessToken }
    }
  });
});

export default {
  emailSignUp,
  emailSignIn,
  signOut,
  refreshToken
};