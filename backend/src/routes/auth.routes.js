import { Router } from "express";
import { login, register, logout } from "../controllers/auth.controller.js";
import {authenticateToken} from "../middlewares/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

authRouter.get("/me", authenticateToken, (req, res) => {
  res.json({
    user: req.user
  });
});