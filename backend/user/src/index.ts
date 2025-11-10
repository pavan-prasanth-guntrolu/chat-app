import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { createClient } from "redis";
import userRoutes from "./routes/user.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import cors from "cors";
dotenv.config();

connectDB();
connectRabbitMQ();

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

app.use(express.json());
app.use(cors());

app.use("/api/v1", userRoutes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log("User service is running on port " + port);
});
