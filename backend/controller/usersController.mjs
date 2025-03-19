import { log } from "console";
import userModel from "../models/customerModels.mjs";
import groupsModels from "../models/groupsModels.mjs";
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
  try {
    const customerData = await userModel
      .findOne({ _id: customerID })
      .populate("groups");
    const groupData = await groupsModels
      .findOne({ _id: groupID })
      .populate("monthly");

    console.log(groupData.monthly);

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error at fetching the customer stats", error);
    res.status(400).json({
      success: false,
      message: "Error at fetching the customer stats",
    });
  }
};

export { addCustomer, searchCustomer, listCustomer, customerStats };
