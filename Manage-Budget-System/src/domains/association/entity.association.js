import Budget from "../entities/budget.entity.js";
import Income from "../entities/income.entity.js";
import Outcome from "../entities/outcome.entity.js";
import BudgetHistory from "../histories/budget.history.js";

// relation one to many between budget and income
Budget.hasMany(Income, { foreignKey: "budgetId" });
// relation one to many between budget and income end

// relation one to many between budget and outcome
Budget.hasMany(Outcome, { foreignKey: "budgetId" });
// relation one to many between budget and income end

Budget.hasMany(BudgetHistory, { foreignKey: "budgetId" });

Income.hasMany(BudgetHistory, { foreignKey: "incomeId" });

Outcome.hasMany(BudgetHistory, { foreignKey: "outcomeId" });
