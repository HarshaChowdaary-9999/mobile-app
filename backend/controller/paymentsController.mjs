import payments from "../models/paymentModels.mjs";
import { monthlyReport } from "../models/groupsModels.mjs";
import customerModels from "../models/customerModels.mjs";
//add payment information
const addPayment = async (req, res) => {
  try {
    const {
      customerID,
      groupID,
      customerName,
      paidToCustomer,
      monthID,
      paidTo,
      amount,
      paymentMethod,
    } = req.body;

    const paymentInfo = new payments({
      customerID,
      groupID,
      customerName,
      paidToCustomer,
      monthID,
      paidTo,
      amount,
      paymentMethod,
    });

    await paymentInfo.save();

    await monthlyReport.updateOne(
      { _id: monthID },
      {
        $push: { paymentSheet: paymentInfo._id },
        $inc: { amountReceived: amount },
      }
    );

    await customerModels.updateOne(
      { _id: customerID, "groups.groupID": groupID },
      {
        $push: { payments: paymentInfo._id },
        $inc: { "groups.$.debtAmount": -amount },
      }
    );
    console.log("Added payment information successfully");

    res.status(200).json({
      success: true,
      message:
        "succesffully added payment information and updated payment sheet in monthly report",
      data: paymentInfo,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ success: false, message: "error at adding payments" });
  }
};
//Amount received monthly
const amountReceivedMonthly = async (req, res) => {
  try {
    const amountdata = await payments.aggregate([
      {
        $group: {
          _id: "$monthID",
          total: { $sum: "$amount" },
        },
      },
    ]);
    res.status(200).json({ success: true, data: amountdata });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ success: false, message: "error at amount received monthly" });
  }
};

export { addPayment, amountReceivedMonthly };
