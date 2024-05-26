import express from "express";
import {
  buyCoins,
  createPaymentIntent,
} from "../controllers/coinController.js";

const router = express.Router();

router.post("/buy", buyCoins);
router.post("/create-payment-intent", createPaymentIntent);

export default router;
