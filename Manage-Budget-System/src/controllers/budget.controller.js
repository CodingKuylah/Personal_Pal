import Budget from "../domains/entities/budget.entity.js";
import { handleFailedResponse } from "../utils/response-handling/failed-response/handle.failed-response.js";
import { handleSuccessResponse } from "../utils/response-handling/success-response/handle.success-response.js";
import { handleErrorResponse } from "../utils/response-handling/error-response/handle.error-response.js";

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

export { getBudgetById };
