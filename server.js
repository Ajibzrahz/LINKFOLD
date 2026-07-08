// app entry, mounts routes
import dotenv from "./config/env.js";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import pageRouter from "./route/pages.js";
import publicRouter from "./route/public.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/pages", pageRouter);
app.use("/api/v1/public", publicRouter)

app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`App is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start()
