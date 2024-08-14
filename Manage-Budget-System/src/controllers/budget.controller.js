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

async function createBudget(req, res){
  const {title, description, total_balance} = req.body;
  const userId = req.accountId;
  const createBudgetDTO = new CreateBudgetRequest(title, description, total_balance)
  const validationErrors = createBudgetDTO.validate();

  if(validationErrors.length > 0){
  return handleFailedResponse(res, validationErrors, 500);
  }

  const finalTotalBalance = total_balance || 0.0;
  try{
    const newBudget = await Budget.create({
      title: createBudgetDTO.title,
      description: createBudgetDTO.description,
      total_balance: finalTotalBalance,
    })

    const newIncome = await Income.create({
      description: "FIRST COMMIT (Default by systems)",
      amount: 0.0,
      created_by: "Systems"
    })

    const newOutcome = await Outcome.create({
      description: "FIRST COMMIT (Default by systems)",
      amount: 0.0,
      created_by: "Systems"
    })

    await BudgetUser.create({
      budget_id : newBudget.id,
      user_id: userId
    });

    await IncomeUser.create({
      income_id: newIncome.id,
      user_id: userId
    });

    await OutcomeUser.create({
      outcome_id: newOutcome.id,
      user_id: userId
    })

    const handlingResponse = new CreateBudgetResponse(
        newBudget.id,
        newBudget.title,
        newBudget.description,
        newIncome.id,
        newOutcome.id,
        userId
    )
    return handleSuccessResponse(res, handlingResponse, 200, "New Budget Successfully Created")
  }catch (err){
    return handleErrorResponse(res, err)
  }
}

export { getBudgetById, createBudget };
