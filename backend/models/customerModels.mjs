import mongoose from "mongoose";

const Schema = mongoose.Schema;

const debt = new Schema({
  groupID: {
    type: Schema.Types.ObjectId,
    ref: "group",
  },
  debtAmount: {
    type: Number,
    default: 0,
  },
});

const customer = new Schema({
  customerName: {
    type: String,
  },
  contactNo: {
    type: String,
  },
  address: {
    type: String,
  },
  groups: [debt],
  payments: [
    {
      type: Schema.Types.ObjectId,
      ref: "payments",
    },
  ],
});
export default mongoose.model("customers", customer);
