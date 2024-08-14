import Income from "../domains/entities/income.entity.js";
import { handleFailedResponse } from "../utils/response-handling/failed-response/handle.failed-response.js";
import { handleSuccessResponse } from "../utils/response-handling/success-response/handle.success-response.js";
import { handleErrorResponse } from "../utils/response-handling/error-response/handle.error-response.js";

async function getIncomeById(req, res) {
  try {
    const income = await Income.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (income == null || !income) {
      return handleFailedResponse(
        res,
        `Income with id ${req.params.id} not found`,
        403,
      );
    }

    return handleSuccessResponse(
      res,
      income,
      200,
      "Income successfully retrieved",
    );
  } catch (err) {
    handleFailedResponse(res, err, 500);
    return handleErrorResponse(res, err);
  }
}

export { getIncomeById };
