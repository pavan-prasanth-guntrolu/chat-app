import express from "express";
import dotenv from "dotenv";
import { startSendOtpConsumer } from "./consumer.js";
dotenv.config();

const app = express();

startSendOtpConsumer();

const PORT = process.env.PORT;

// 2. Create a dummy endpoint for health checks
app.get("/", (req, res) => {
  res.send("Mail Service is running and listening to RabbitMQ");
});

app.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});
