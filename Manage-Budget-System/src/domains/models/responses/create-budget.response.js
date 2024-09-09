class CreateBudgetResponse {
  constructor(
    budgetId,
    title,
    description,
    total_balance,
    target_total_balance,
    incomeId,
    outcomeId,
    userId,
  ) {
    this.budgetId = budgetId;
    this.title = title;
    this.description = description;
    this.total_balance = total_balance;
    this.target_total_balance = target_total_balance;
    this.incomeId = incomeId;
    this.outcomeId = outcomeId;
    this.userId = userId;
  }
}

export default CreateBudgetResponse;
