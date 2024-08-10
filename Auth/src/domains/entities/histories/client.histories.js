import { Sequelize } from "sequelize";
import db from "../../../configuration/database.configuration.js";

const { DataTypes } = Sequelize;

const ClientHistories = db.define(
  "tb_tr_client_histories",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      validate: {
        len: [5, 35],
      },
    },
    first_name: {
      type: DataTypes.STRING,
      validate: {
        len: [3, 35],
      },
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        len: [3, 35],
      },
    },
    email: {
      type: DataTypes.STRING,
    },
    number_phone: {
      type: DataTypes.STRING,
    },
    account_status: {
      type: DataTypes.ENUM,
      values: [
        "ACCOUNT_DELETED",
        "ACCOUNT_BANNED",
        "UNVERIFIED",
        "VERIFIED",
        "LOGIN_FAILED_ONCE",
        "LOGIN_FAILED_TWICE",
      ],
    },
    gender: {
      type: DataTypes.ENUM,
      values: ["MALE", "FEMALE"],
    },
    type: {
      type: DataTypes.ENUM,
      values: ["REGISTER", "VERIFY_ACCOUNT", "UPDATE_PROFILE", "FORGOT_PASSWORD"],
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

export default ClientHistories;
