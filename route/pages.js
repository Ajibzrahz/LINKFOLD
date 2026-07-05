// CRUD for pages/links (Person 1, protected)
import express from "express";
import {
  createPage,
  deletePage,
  getPage,
  updatePage,
} from "../controller/page-controller";
import authenticate from "../middleware/auth";

const router = express.Router();
router.use(authenticate)

router.route("/").put(updatePage).post(createPage).delete(deletePage);
router.get("/:username", getPage);


export default router