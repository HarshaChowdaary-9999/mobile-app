import mongoose from "mongoose";

const Schema = mongoose.Schema;

const customerSheet = new Schema({
  customerID: {
    type: Schema.Types.ObjectId,
    ref: "customers",
  },
  groupID: {
    type: Schema.Types.ObjectId,
    ref: "groups",
  },
  monthID: {
    type: Schema.Types.ObjectId,
    ref: "month",
  },
  payment: {
    type: Schema.Types.ObjectId,
    ref: "payment",
  },
});

const customerPaymentMonthly = mongoose.model(
  "customerPaymentMonthly",
  customerSheet
);

const month = new Schema({
  month: {
    type: String,
  },
  amount: {
    type: Number,
  },
  amountReceived: {
    type: Number,
    default: 0,
  },
  groupID: {
    type: Schema.Types.ObjectId,
    ref: "groups",
  },
  takenBy: {
    type: Schema.Types.ObjectId,
    ref: "customers",
  },
  paymentSheet: [
    {
      type: Schema.Types.ObjectId,
      ref: "Payments",
    },
  ],
});

const monthlyReport = mongoose.model("monthlyReport", month);
export { monthlyReport, customerPaymentMonthly };
const group = new Schema({
  groupID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "group",
  },
  groupName: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  customers: [
    {
      type: Schema.Types.ObjectId,
      ref: "customers",
    },
  ],
  monthly: [
    {
      type: Schema.Types.ObjectId,
      ref: "monthlyReport",
    },
  ],
});

export default mongoose.model("group", group);
