import express from "express";
import dotenv from "dotenv";
import { startSendOtpConsumer } from "./consumer.js";
dotenv.config();

const app = express();

const PORT = Number(process.env.PORT || 4000);

startSendOtpConsumer();

app.get("/", (req, res) => {
  res.status(200).send("✅ Mail microservice is running. Don't sleep!");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
