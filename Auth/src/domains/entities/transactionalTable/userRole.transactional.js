import { Sequelize } from "sequelize";
import db from "../../../configuration/database/database.configuration.js";
import { v4 as uuidv4 } from "uuid";

const { DataTypes } = Sequelize;

const UserRole = db.define(
  "tb_tr_user_role",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => uuidv4(),
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  },
);

export default UserRole;
