import express from "express";
import dotenv from "dotenv";
import { startSendOtpConsumer } from "./consumer.js";
dotenv.config();

const app = express();

startSendOtpConsumer();

app.get("/", (req, res) => {
  res.send("Mail Service Running");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});
