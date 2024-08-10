import { Sequelize } from "sequelize";

const db = new Sequelize(process.env.DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: console.log,
  timezone: "+07:00",
});

export default db;
