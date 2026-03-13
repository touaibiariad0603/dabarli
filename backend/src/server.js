import express from "express";
import { clerkMiddleware } from '@clerk/express'
import { connectDB } from "./config/db.js";

const app = express();

app.use(clerkMiddleware());

// Middleware
app.use(express.json());//adds auth object  under  the req =>request.aut

// Root route
app.get("/", (req, res) => {
  res.send("Dabarli Backend is running!");
});

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "success" });
});

const PORT = process.env.PORT || 3000;

// Start server
const startServer = async () => {
  try {
    await connectDB(); // connect to MongoDB first

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();