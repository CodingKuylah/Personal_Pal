import Budget from "../domains/entities/budget.entity.js";
import { handleFailedResponse } from "../utils/response-handling/failed-response/handle.failed-response.js";
import { handleSuccessResponse } from "../utils/response-handling/success-response/handle.success-response.js";
import { handleErrorResponse } from "../utils/response-handling/error-response/handle.error-response.js";
import CreateBudgetRequest from "../domains/models/requests/create-budget.request.js";
import Income from "../domains/entities/income.entity.js";
import Outcome from "../domains/entities/outcome.entity.js";
import BudgetUser from "../domains/entities/transactional-table.entity/budget-user.transactional.js";
import IncomeUser from "../domains/entities/transactional-table.entity/income-user.transactional.js";
import OutcomeUser from "../domains/entities/transactional-table.entity/outcome-user.transactional.js";
import CreateBudgetResponse from "../domains/models/responses/create-budget.response.js";
import BudgetHistory from "../domains/histories/budget.history.js";
import UpdateBudgetResponse from "../domains/models/responses/update-budget.response.js";

async function getBudgetById(req, res) {
  try {
    const budget = await Budget.findOne({
      where: {
        id: req.params.budgetId,
      },
    });
    if (budget == null) {
      return handleFailedResponse(
        res,
        `Budget with id ${req.params.budgetId} is not found`,
        404,
      );
    }
    return handleSuccessResponse(
      res,
      budget,
      200,
      "Budget Successfully Retrieved",
    );
  } catch (err) {
    handleFailedResponse(res, err, 500);
    return handleErrorResponse(res, err);
  }
}

async function createBudget(req, res) {
  const { title, description, total_balance, target_total_balanced } = req.body;
  // const userId = req.accountId;
  const createBudgetDTO = new CreateBudgetRequest(
    title,
    description,
    total_balance,
    target_total_balanced,
  );
  const validationErrors = createBudgetDTO.validate();

  if (validationErrors.length > 0) {
    return handleFailedResponse(res, validationErrors, 500);
  }
  const targeted_total_balance = createBudgetDTO.target_total_balance || null;
  const finalTotalBalance = total_balance || 0.0;
  try {
    const newBudget = await Budget.create({
      title: createBudgetDTO.title,
      description: createBudgetDTO.description,
      total_balance: finalTotalBalance,
      target_total_balance: targeted_total_balance,
      created_by: "system",
    });

    const newIncome = await Income.create({
      description: "FIRST COMMIT (Default by systems)",
      amount: 0.0,
      created_by: "Systems",
    });

    const newOutcome = await Outcome.create({
      description: "FIRST COMMIT (Default by systems)",
      amount: 0.0,
      created_by: "Systems",
    });

    await BudgetUser.create({
      budget_id: newBudget.id,
      user_id: "null",
    });

    await IncomeUser.create({
      income_id: newIncome.id,
      user_id: "null",
    });

    await OutcomeUser.create({
      outcome_id: newOutcome.id,
      user_id: "null",
    });

    await BudgetHistory.create({
      title: title,
      description: description,
      total_balance: total_balance,
      amount: finalTotalBalance,
      type: "BUDGET_CREATE",
      created_by: "Systems",
    });

    const handlingResponse = new CreateBudgetResponse(
      newBudget.id,
      newBudget.title,
      newBudget.description,
      finalTotalBalance,
      targeted_total_balance,
      newIncome.id,
      newOutcome.id,
      null,
    );
    return handleSuccessResponse(
      res,
      handlingResponse,
      200,
      "New Budget Successfully Created",
    );
  } catch (err) {
    return handleErrorResponse(res, err);
  }
}

async function updateBudget(req, res) {
  const { title, description, total_balance } = req.body;
  const budgetId = req.params.budgetId;
  try {
    await Budget.update(
      { title: title, description: description, total_balance: total_balance },
      {
        where: {
          id: budgetId,
        },
      },
    );

    const handlingResponse = new UpdateBudgetResponse(
      budgetId,
      title,
      description,
      total_balance,
    );

    return handleSuccessResponse(
      res,
      handlingResponse,
      200,
      "Budget successfully updated",
    );
  } catch (err) {
    return handleErrorResponse(res, err);
  }
}

export { getBudgetById, createBudget, updateBudget };
