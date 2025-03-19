import express from "express";
import {
  addPayment,
  amountReceivedMonthly,
} from "../controller/paymentsController.mjs";

const router = express.Router();

router.post("/addPayment", addPayment);

router.get("/monthlyPaymentreceived", amountReceivedMonthly);

export default router;
