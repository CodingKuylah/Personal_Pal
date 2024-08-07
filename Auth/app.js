import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./src/configuration/database.configuration.js";
import AuthRoute from "./src/routes/auth.route.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

db.authenticate()
  .then(() => {
    console.log("Auth db is connected");
    console.log(process.env.BASE_ROUTER);
    db.sync({ alter: true })
      .then(() => {
        app.listen("8010", () => console.log("\n Auth service is started \n "));
      })
      .catch((error) => {
        console.error("Error occurred: ", error);
      });
  })
  .catch((error) => {
    console.error("Auth Service error cannot connect to database: ", error);
  });

app.use(AuthRoute);
