//stats for dashboard (Person 1, Pro-only)
import express from "express";
import authenticate from "../middleware/auth.js";
import { analytics } from "../controller/analytics-controller.js";

const router = express.Router();
router.use(authenticate);

router.get("", analytics);
export default router;
