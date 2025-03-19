import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Payment = new Schema({
  customerID: {
    type: Schema.Types.ObjectId,
    ref: "customers",
  },
  customerName: {
    type: "string",
  },
  groupID: {
    type: Schema.Types.ObjectId,
    ref: "groups",
  },
  monthID: {
    type: Schema.Types.ObjectId,
    ref: "month",
  },
  paidTo: {
    type: Schema.Types.ObjectId,
    ref: "customers",
  },
  paidToCustomer: {
    type: "string",
  },
  amount: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  paymentMethod: {
    type: String,
  },
  proff: {
    type: String,
  },
});

export default mongoose.model("Payments", Payment);
