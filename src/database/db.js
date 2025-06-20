import "server-only";
import mongoose from "mongoose";

// Track connection state
let isConnected = false;

const db = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return true;
  }

  if (mongoose.connection.readyState === 2) {
    console.log("MongoDB connection is in progress...");
    try {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Connection timeout"));
        }, 10000); // 10 seconds

        mongoose.connection.once("connected", () => {
          clearTimeout(timeout);
          isConnected = true;
          resolve();
        });

        mongoose.connection.once("error", (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      });
      return true;
    } catch (error) {
      console.error("Error waiting for connection:", error);
      throw error;
    }
  }

  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is not defined");
    }

    console.log("Connecting to MongoDB...");

    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });

    isConnected = true;
    console.log("MongoDB connected successfully");
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    isConnected = false;

    if (error instanceof Error) {
      if (error.name === "MongooseServerSelectionError") {
        throw new Error(
          "Unable to connect to MongoDB server. Please check your connection string and network connectivity."
        );
      } else if (error.name === "MongoParseError") {
        throw new Error("Invalid MongoDB connection string format.");
      } else if (error.message.includes("authentication")) {
        throw new Error(
          "MongoDB authentication failed. Please check your credentials."
        );
      } else {
        throw new Error(`Database connection failed: ${error.message}`);
      }
    } else {
      throw new Error("Unknown database connection error");
    }
  }
};

// Mongoose event listeners
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
  isConnected = true;
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
  isConnected = false;
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
  isConnected = false;
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}, closing MongoDB connection...`);
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Health check
export const checkDbHealth = async () => {
  try {
    if (!isConnected) {
      return {
        status: "disconnected",
        readyState: mongoose.connection.readyState,
      };
    }

    await mongoose.connection.db?.admin().ping();

    return {
      status: "healthy",
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
    };
  } catch (error) {
    return {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      readyState: mongoose.connection.readyState,
    };
  }
};
// Disconnect function
export const disconnectDb = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    isConnected = false;
    console.log("MongoDB connection closed manually");
  }
};

export default db;
