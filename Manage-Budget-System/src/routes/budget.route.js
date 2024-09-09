import express from "express";
import {
  createBudget,
  getBudgetById,
  updateBudget,
} from "../controllers/budget.controller.js";
import verifyToken from "../middleware/consumer/verify-token.consumer.js";

const router = express.Router();

router.get(process.env.BASE_ROUTER + ":budgetId", verifyToken, getBudgetById);
router.post(process.env.BASE_ROUTER + "create", createBudget);
router.put(process.env.BASE_ROUTER + "updated/:budgetId", updateBudget);

export default router;
