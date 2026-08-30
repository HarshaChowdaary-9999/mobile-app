import { log } from "console";
import userModel from "../models/customerModels.mjs";
import groupsModels from "../models/groupsModels.mjs";
import { monthlyReport } from "../models/groupsModels.mjs";
import paymentModels from "../models/paymentModels.mjs";
import { match } from "assert";
//Add new customer

const addCustomer = async (req, res) => {
  try {
    const { customerName, contactNo, address } = req.body;

    const isAlreadyExist = await userModel.find({ customerName, contactNo });

    const newCustomer = new userModel({ customerName, contactNo, address });

    if (isAlreadyExist.length > 0) {
      res.status(201).json({
        success: false,
        message: "customer already exists",
      });
    } else {
      await newCustomer.save();
      res.status(200).json({
        success: true,
        message: "Added Customer Details scessfully",
        data: newCustomer,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error while adding customer" });
  }
};

//Search for customers returns customers

const searchCustomer = async (req, res) => {
  try {
    const customerName = req.params.customerName;
    console.log(customerName);

    const customerDetails = await userModel.find({
      customerName: { $regex: customerName, $options: "i" },
    });
    res.status(200).json({
      success: true,
      message: "Customer Details",
      data: customerDetails,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ success: false, message: "Error while searching for customers" });
  }
};
//General search means list of customers
const listCustomer = async (req, res) => {
  try {
    const customerList = await userModel.find({}, { _id: 1, customerName: 1 });
    if (customerList.length > 0) {
      res.status(200).json({ success: true, data: customerList });
    } else {
      res.status(404).json({ success: false, message: "No data" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ success: false, message: "error at listing custoemrs" });
  }
};

//Overall customers stats on group
const customerStats = async (req, res) => {
  const customerID = req.params.customerID;
  const groupID = req.params.groupID;
  let data = [];
  try {
    const groupData = await groupsModels
      .findOne({ _id: groupID })
      .populate({ path: "monthly", populate: { path: "paymentSheet" } });

    let temp = {};
    groupData.monthly.map((month) => {
      temp["month"] = month.month;
      temp["monthAmount"] = month.amount;
      temp["paidAmount"] = 0;
      temp["paymentIds"] = [];
      temp["monthID"] = month._id;
      temp["paymentsHistory"] = [];
      month.paymentSheet.map((paymentSheet) => {
        if (paymentSheet.customerID.equals(customerID)) {
          console.log(paymentSheet);

          temp["paidAmount"] = temp["paidAmount"] + paymentSheet.amount;
          temp["paymentIds"].push(paymentSheet._id);
          temp["paymentsHistory"].push(paymentSheet);
        }
      });
      data.push(temp);
      temp = {};
    });

    console.log("customer Stats", data[0].paymentsHistory);

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.log("Error at fetching the customer stats", error);
    res.status(400).json({
      success: false,
      message: "Error at fetching the customer stats",
    });
  }
};

const customerStatsMonthly = async (req, res) => {
  try {
    const customerID = req.params.customerID;
    const monthID = req.params.monthID;
    console.log(monthID, customerID);
    const month = await monthlyReport
      .findOne({ _id: monthID })
      .populate("paymentSheet");

    const filteredData = await month.paymentSheet.filter(
      (data) => data.customerID.toString() === customerID.toString()
    );

    //console.log(filteredData);

    res.status(200).json({ success: true, payments: filteredData });
  } catch (error) {
    console.log("Error at fetching the customer stats monthly", error);
  }
};

export {
  addCustomer,
  searchCustomer,
  listCustomer,
  customerStats,
  customerStatsMonthly,
};
