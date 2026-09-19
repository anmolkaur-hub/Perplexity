import { Router } from "express";
import {
  register,
  verifyEmail,
  login,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import authUser from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", ...registerValidator, register);
authRouter.get("/verify-email", verifyEmail);
authRouter.post("/login", ...loginValidator, login);
authRouter.post("/logout", authUser, logout);
authRouter.get("/get-me", authUser, getMe);

export default authRouter;
