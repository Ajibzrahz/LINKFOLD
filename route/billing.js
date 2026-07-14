// route/billing.js
import express from "express";
import { checkout, webhook } from "../controller/billing-controller.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

router.post("/webhook", webhook);
router.post("/checkout", authenticate, checkout); 

export default router;
