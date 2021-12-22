import "reflect-metadata";
import "dotenv/config";

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import "./utils/response/customSuccess";
import { dbCreateConnection } from "./typeorm/dbCreateConnection";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import path from "path";
import mercadopago from "mercadopago";

export const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("combined"));

app.use("/", routes);
app.use("/uploads", express.static(path.resolve("uploads")));

app.use(errorHandler);

mercadopago.configure({
  access_token:
    "TEST-736369727964382-122215-ce23a8b8c8ed6bf33195fa54ce8a1719-713640721",
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

(async () => {
  await dbCreateConnection();
})();
