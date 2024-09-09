import { Sequelize } from "sequelize";
import db from "../../configurations/database.configuration.js";

const { DataTypes } = Sequelize;

const BudgetHistory = db.define(
  "tb_tr_budget-history",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    total_balance: {
      type: DataTypes.DECIMAL(20, 3),
    },
    amount: {
      type: DataTypes.DECIMAL(20, 3),
    },
    type: {
      type: DataTypes.ENUM,
      values: ["INCOME", "OUTCOME", "BUDGET_CREATE"],
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
);

export default BudgetHistory;
