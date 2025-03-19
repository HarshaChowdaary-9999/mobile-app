import groupsModels from "../models/groupsModels.mjs";
import { monthlyReport } from "../models/groupsModels.mjs";
import customerModels from "../models/customerModels.mjs";
import paymentModels from "../models/paymentModels.mjs";
//Create new GroupModel
import mongoose from "mongoose";
const createGroup = async (req, res) => {
  try {
    const { groupName, startDate, endDate } = req.body;

    const alreadyExists = await groupsModels.findOne({ groupName, startDate });
    const newGroupData = new groupsModels({
      groupName: groupName,
      startDate: startDate,
      endDate: endDate,
    });

    if (alreadyExists) {
      res.status(201).json({
        success: false,
        message: "Group already exists",
      });
    } else {
      await newGroupData.save();
      res.status(200).json({
        success: true,
        message: "Added group name scessfully",
        data: newGroupData,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Error at create Group" });
  }
};

//Add customers to the group

const addCustomerToGroup = async (req, res) => {
  try {
    const { customer, group } = req.body;

    const customerupdate = await customerModels.updateOne(
      { _id: customer },
      { $push: { groups: { groupID: group, debtAmount: 0 } } }
    );
    const groupData = await groupsModels.updateOne(
      { _id: group },
      { $push: { customers: customer } }
    );

    //console.log(JSON.stringify(gd, null, 2));

    res.status(200).json({ message: true, data: groupData });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Error at addCustomerToGroup" });
  }
};

//add month to group

const addMonth = async (req, res) => {
  try {
    const { month, amount, groupID } = req.body;

    const existMonthdata = await monthlyReport.find({ month, amount, groupID });

    const customers = await groupsModels.findOne(
      { _id: groupID },
      { customers: 1, _id: 0 }
    );
    const customersObj = customers.customers;

    const newMonthdata = new monthlyReport({ month, amount, groupID });
    if (existMonthdata.length == 0) {
      await newMonthdata.save();
      await customerModels.updateMany(
        { _id: { $in: customersObj }, "groups.groupID": groupID },
        { $inc: { "groups.$.debtAmount": amount } }
      );
      res.status(200).json({
        success: true,
        message: "Added new month successfully",
        data: newMonthdata,
      });
      await groupsModels.updateOne(
        { _id: groupID },
        { $push: { monthly: newMonthdata._id } }
      );
    } else {
      res
        .status(200)
        .json({ success: false, message: "looks like month already exists" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Error at addMonth" });
  }
};

//fetch months in the group
const fetchMonths = async (req, res) => {
  try {
    const groupID = req.body.groupID;
    const monthlyData = await groupsModels
      .findById(groupID)
      .populate("monthly");
    if (!monthlyData) {
      res.status(404).json({ message: "Group not found" });
    }
    res.status(200).json({ success: true, data: monthlyData });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Error at fetchMonths" });
  }
};

//Monthly payment sheet
const fetchMonthlyPaymentSheet = async (req, res) => {
  try {
    const monthID = req.params.monthID;

    const monthPaymentData = await monthlyReport
      .findById(monthID)
      .populate("paymentSheet");
    if (!monthPaymentData) {
      res.status(404).json({ message: "month not found" });
    }
    res.status(200).json({ success: true, data: monthPaymentData });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: "error at fetchMonths" });
  }
};

//fetch customers in group

const fetchCustomer = async (req, res) => {
  try {
    const groupID = req.params.groupID;

    const customers = await groupsModels
      .findById(groupID)
      .populate("customers");
    if (!customers) {
      res.status(404).json({ success: false, message: "No group found" });
    }
    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "error at fetch" });
  }
};

//Debt History

const debtHistory = async (req, res) => {
  try {
    const customerDebts = await customerModels.aggregate([
      { $unwind: "$groups" },
      {
        $group: {
          _id: "$_id",
          totalDebt: { $sum: "$groups.debtAmount" },
        },
      },
      { $sort: { totalDebt: -1 } }, // Sort by highest debt
    ]);

    res.status(200).json({ success: true, data: customerDebts });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "error at debt-history" });
  }
};

//Customers Group wise debt details THIS IS NOT YET DONE NEED SOME FINAL TOUCHES

const customerGroupDept = async (req, res) => {
  try {
    const { customerID, groupID } = req.body;

    const details = await monthlyReport.find({
      groupID,
      paymentSheet: { $elemMatch: { customerID: customerID } },
    });

    console.log(details);

    res.status(200).json({
      success: true,
      data: await monthlyReport.find({ groupID }).populate("paymentSheet"),
    });
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .json({ success: false, message: "error at customer group wise dept" });
  }
};

//fetch group data

const fetchGroupData = async (req, res) => {
  try {
    const groupsData = await groupsModels.find({}).populate("monthly");
    res.status(200).json({
      success: true,
      data: groupsData,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "error at group fetch" });
  }
};

//Api to help edit icon in group view

const groupViewHelper = async (req, res) => {
  try {
    const groupID = req.params.id;
    console.log(groupID);

    const groupData = await groupsModels
      .findOne({ _id: groupID })
      .populate("monthly");
    const groupName = groupData.groupName;
    const monthlyData = groupData.monthly;
    const totalCustomers = groupData.customers.length;
    let totalAmount = 0;
    let totalAmountPerCustomer = 0;
    let collectedAmount = 0;
    monthlyData.map((x) => {
      totalAmount += totalCustomers * x.amount;
      totalAmountPerCustomer += x.amount;
    });

    const payment = await paymentModels.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "customerID",
          foreignField: "_id",
          as: "customerInfo",
        },
      },
      {
        $match: { groupID: new mongoose.Types.ObjectId(groupID) },
      },
      {
        $group: {
          _id: "$customerID",
          totalPayment: { $sum: "$amount" },
          customerName: { $first: "$customerInfo.customerName" },
        },
      },
    ]);
    payment.map((x) => {
      collectedAmount += x["totalPayment"];
    });

    console.log(payment, collectedAmount);
    res.status(200).json({
      success: true,
      groupName: groupName,
      totalCustomers: totalCustomers,
      totalAmount: totalAmount,
      totalAmountPerCustomer: totalAmountPerCustomer,
      paymentInfo: payment,
      collectedAmount: collectedAmount,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ success: false, message: "error at groupview helper" });
  }
};

export {
  createGroup,
  addCustomerToGroup,
  addMonth,
  fetchMonths,
  fetchMonthlyPaymentSheet,
  fetchCustomer,
  debtHistory,
  customerGroupDept,
  fetchGroupData,
  groupViewHelper,
};
