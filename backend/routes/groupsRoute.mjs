import express from "express";
import {
  addCustomerToGroup,
  addMonth,
  createGroup,
  customerGroupDept,
  debtHistory,
  fetchCustomer,
  fetchGroupData,
  fetchMonthlyPaymentSheet,
  fetchMonths,
  groupViewHelper,
} from "../controller/groupsController.mjs";

const router = express.Router();

router.post("/createGroup", createGroup);

router.post("/addCustomerToGroup", addCustomerToGroup);

router.post("/addMonth", addMonth);

router.get("/fetchMonthly", fetchMonths);

router.get("/monthlyPayment/:monthID", fetchMonthlyPaymentSheet);

router.get("/fetchCustomers/:groupID", fetchCustomer);

router.get("/fetchDebts", debtHistory);

router.get("/monthlyDebtsCustomer", customerGroupDept);

router.get("/fetchGroups", fetchGroupData);

router.get("/groupViewHelper/:id", groupViewHelper);

export default router;
