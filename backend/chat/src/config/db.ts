import mongoose from "mongoose";

async function connectDB() {
  const url = process.env.MONGO_URI;
  if (!url) {
    throw new Error("MONGO_URI is missing. Add it to your .env file.");
  }

  try {
    await mongoose.connect(url, {
      dbName: "microserviceschatapp",
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Failed to connect to MongoDB", err);
  }
}

export default connectDB;
