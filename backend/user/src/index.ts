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
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.log("Too many retries on Redis. Stopping reconnect.");
        return new Error("Too many retries");
      }
      return retries * 500; // Exponential backoff
    },
  },
});

// Handle Redis errors gracefully
redisClient.on("error", (error) => {
  console.error("Redis Client Error:", error.message);
});

redisClient.on("reconnecting", () => {
  console.log("Redis client reconnecting...");
});

redisClient.on("ready", () => {
  console.log("Redis client is ready");
});

redisClient
  .connect()
  .then(() => console.log("Connected to Redis successfully"))
  .catch((error) => {
    console.error("Failed to connect to Redis:", error.message);
    console.log("Application will continue without Redis cache");
  });

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", userRoutes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log("User service is running on port " + port);
});
