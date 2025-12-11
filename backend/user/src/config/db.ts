import mongoose from "mongoose";

async function connectDB() {
  const url = process.env.MONGO_URI;
  if (!url) {
    console.error("MONGO_URI is missing. Add it to your .env file.");
    process.exit(1);
  }

  try {
    await mongoose.connect(url, {
      dbName: "microserviceschatapp",
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log("✅ Connected to MongoDB successfully");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    console.error("Please check your MONGO_URI and ensure MongoDB is running");
    process.exit(1);
  }
}

export default connectDB;
