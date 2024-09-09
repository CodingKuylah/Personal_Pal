import { Sequelize } from "sequelize";
import db from "../../configuration/database/database.configuration.js";
import { v4 as uuidv4 } from "uuid";

const { DataTypes } = Sequelize;

const Account = db.define(
  "tb_m_accounts",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => uuidv4(),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 35],
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verification_code: {
      type: DataTypes.STRING,
    },
    refresh_token: {
      type: DataTypes.TEXT,
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
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    deleted_at: {
      type: DataTypes.DATE,
    },
    delete_by: {
      type: DataTypes.STRING,
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
);

export default Account;
