//GET /:username, GET /r/:linkId (Person 2, open)
import express from "express";
import {
  getPublicPage,
  redirectLink,
} from "../controller/public-controller.js";

const router = express.Router();

router.get("/:username", getPublicPage);
router.get("/r/:linkId", redirectLink);

export default router;
