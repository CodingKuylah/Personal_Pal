import db from "../../../configurations/database.configuration.js";
import { Sequelize } from "sequelize";

const { DataTypes } = Sequelize;

const OutcomeUser = db.define(
  "tb_tr_outcome_user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    outcome_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
);

export default OutcomeUser;
