import express from "express";

import { ErrorRes } from "../utils/response";

import authController from "../controllers/auth";
import usersController from "../controllers/users";

import authValidation from "../validations/auth";
import usersValidation from "../validations/users";

import bearer from "../middlewares/bearer";
import { session } from "../middlewares/sessions";

// Auth
const authRouter = express.Router();
authRouter.post("/signup/email", authValidation.emailSignUp, authController.emailSignUp);
authRouter.post("/signin/email", authValidation.emailSignIn, authController.emailSignIn);
authRouter.post("/signout", session, authController.signOut);
authRouter.post("/refresh", authController.refreshToken);

// User
const userRouter = express.Router();
userRouter.use(session);
userRouter.get("/:uid", usersValidation.detailedUsers, usersController.detailedUsers);

const router = express.Router();
router.use(bearer);
router.use("/auth", authRouter);
router.use("/users", userRouter);

router.use((req, res) => {
  return ErrorRes(res, { error: "NOT_FOUND", message: "Route not found" });
});

export default router;
