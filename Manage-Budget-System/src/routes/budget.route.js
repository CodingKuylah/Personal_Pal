import express from "express";
import { getBudgetById } from "../controllers/budget.controller.js";

const router = express.Router();

router.get(process.env.BASE_ROUTER + ":budgetId", getBudgetById);

export default router;
