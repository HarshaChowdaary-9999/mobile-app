import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3000;

const database = {
  url: process.env.MONGO_URI,
};

export { port, database };
