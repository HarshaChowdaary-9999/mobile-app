import {
  addCustomer,
  customerStats,
  listCustomer,
  searchCustomer,
} from "../controller/usersController.mjs";

import express from "express";

const router = express.Router();

router.post("/addCustomer", addCustomer);

router.get("/searchCustomer/:customerName", searchCustomer);

router.get("/listCustomer", listCustomer);

router.get("/customerStats/:customerID/:groupID", customerStats);

export default router;
