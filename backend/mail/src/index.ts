import express from "express";
import dotenv from "dotenv";
import { startSendOtpConsumer } from "./consumer.js";
dotenv.config();

const app = express();

const PORT = Number(process.env.PORT || 4000);

startSendOtpConsumer();

app.get("/", (req, res) => {
  res.send("Mail Service Running");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`server is running on port ${PORT}`);
});
