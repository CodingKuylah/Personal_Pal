class UpdateBudgetResponse {
  constructor(budgetId, title, description, total_balance) {
    this.budgetId = budgetId;
    this.title = title;
    this.description = description;
    this.total_balance = total_balance;
  }
}
export default UpdateBudgetResponse;
