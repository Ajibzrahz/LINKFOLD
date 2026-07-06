// CRUD for pages/links (Person 1, protected)
import express from "express";
import {
  addLink,
  createPage,
  getMyPage,
  removeLink,
} from "../controller/page-controller.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate);

router.route("").post(createPage);
router.get("/me", getMyPage);
router.post("/links", addLink);
router.delete("/links/:id", removeLink);

export default router;
