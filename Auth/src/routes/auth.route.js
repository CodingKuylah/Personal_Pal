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

router.post(process.env.BASE_ROUTER + "auth/register", register);
router.post(process.env.BASE_ROUTER + "auth/account-verify", verifyAccount);
router.post(process.env.BASE_ROUTER + "auth/login", login);
router.post(
  process.env.BASE_ROUTER + "auth/refresh-access-token",
  refreshAccessToken,
);
router.post(process.env.BASE_ROUTER + "auth/logout/:accountId", logout);
router.post(process.env.BASE_ROUTER + "auth/forgot-password", forgotPassword);
router.get(process.env.BASE_ROUTER + "auth/get-all", verifyToken, getAll);

export default router;
