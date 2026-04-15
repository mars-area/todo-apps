import type { Response } from "express";

import { catchAsync, type ControllerRequestType } from "../utils/helpers";
import { ErrorRes, SuccessRes } from "../utils/response";
import { usersService } from "../services/index";

const detailedUsers = catchAsync(async (req: ControllerRequestType, res: Response) => {
  const { uid } = req.params;

  const user = await usersService.getUserDetails(uid as string);
  if (!user)
    return ErrorRes(res, {
      error: "NOT_FOUND",
      message: "User details not found"
    });
  else
    return SuccessRes(res, {
      success: "OK",
      message: "User retrieved successfully",
      data: user
    });
});

export default {
  detailedUsers
};
