import express from "express";
import {
  login,
  register,
  verifyAccount,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post(process.env.BASE_ROUTER + "auth/register", register);
router.post(process.env.BASE_ROUTER + "auth/verify", verifyAccount);
router.post(process.env.BASE_ROUTER + "auth/login", login);

export default router;
