import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import * as keys from "./config/keys.mjs";

import group from "./routes/groupsRoute.mjs";

import customer from "./routes/customerRoute.mjs";

import payments from "./routes/paymentsRoute.mjs";

const app = express();
const database = keys.database;
const port = keys.port;

app.use(cors());

app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.json({ mssg: "welcome" });
});

app.use("/group", group);

app.use("/customer", customer);

app.use("/payment", payments);

mongoose.connect(database.url).then(() => {
  app.listen(port, '0.0.0.0' ,() => {
    console.log(`Connected to db & listening on ${port}`);
  });
});
