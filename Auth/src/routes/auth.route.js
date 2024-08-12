import express from "express";
import {
  forgotPassword,
  getAll,
  login,
  logout,
  refreshAccessToken,
  register,
  verifyAccount,
  verifyToken,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post(process.env.BASE_ROUTER + "register", register);
router.post(process.env.BASE_ROUTER + "account-verify", verifyAccount);
router.post(process.env.BASE_ROUTER + "login", login);
router.post(
  process.env.BASE_ROUTER + "refresh-access-token",
  refreshAccessToken,
);
router.post(process.env.BASE_ROUTER + "logout", verifyToken, logout);
router.post(process.env.BASE_ROUTER + "forgot-password", forgotPassword);
router.get(process.env.BASE_ROUTER + "get-all", verifyToken, getAll);

export default router;
