import { Sequelize } from "sequelize";
import db from "../../configuration/database.configuration.js";

const { DataTypes } = Sequelize;

const Role = db.define(
  "tb_m_roles",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  },
);

export default Role;
