import express from "express";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve} from "inngest/express";

import { functions,inngest } from "./config/inngest.js";


const app = express();



app.use(clerkMiddleware());

// Middleware
app.use(express.json());//adds auth object  under  the req =>request.aut


app.use("/api/inngest",serve({client:inngest, functions}));

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