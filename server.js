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
import analyticsRouter from "./route/analytics.js";
import billingRouter from "./route/billing.js";
import { webhook } from "./controller/billing-controller.js";

const app = express(); // ← must exist before anything calls app.xxx()

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// before express.json() — Stripe needs the raw body to verify the signature
app.post(
  "/api/v1/billing/webhook",
  express.raw({ type: "application/json" }),
  webhook,
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/pages", pageRouter);
app.use("/api/v1/public", publicRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/billing", billingRouter);

app.use(errorHandlerMiddleware);

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

start();
