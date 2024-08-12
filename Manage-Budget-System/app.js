import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./src/configurations/database.configuration.js";
import BudgetRoute from "./src/routes/budget.route.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

db.authenticate()
  .then(() => {
    console.log("Manage Budget Service db is connected");
    db.sync({ alter: true })
      .then(() => {
        app.listen(process.env.PORT_NUMBER, () =>
          console.log("\n Manage-Budget-Service is started \n "),
        );
      })
      .catch((error) => {
        console.error("Error occurred: ", error);
      });
  })
  .catch((error) => {
    console.error(
      "Manage Budget Service error cannot connect to database: ",
      error,
    );
  });

app.use(BudgetRoute);
