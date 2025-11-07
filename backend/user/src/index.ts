import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { createClient } from "redis";
dotenv.config();

connectDB();

if (!process.env.REDIS_URL) {
  throw new Error("Redis URL not found");
}
export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient
  .connect()
  .then(() => console.log("connected to Redis"))
  .catch((error) => console.log(error));

const app = express();

const port = process.env.PORT;

app.listen(port, () => {
  console.log("User service is running on port " + port);
});
