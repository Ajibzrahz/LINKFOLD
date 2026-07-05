// app entry, mounts routes
import express from "express";
import connectDB from "./config/db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import pageRouter from "./route/pages.js";

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

app.use("api/v1/pages", pageRouter)

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
