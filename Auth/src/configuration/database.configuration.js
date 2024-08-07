import { Sequelize } from "sequelize";

const db = new Sequelize("db_personal-pal_auth", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: console.log,
  timezone: "+07:00",
});

export default db;
