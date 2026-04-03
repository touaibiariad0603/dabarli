import express from "express";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve} from "inngest/express";
import cors  from "cors"

import { functions,inngest } from "./config/inngest.js";
import adminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.route.js";
import orderRoutes from "./routes/order.route.js";
import reviewRoutes from "./routes/review.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import { ENV } from "./config/env.js";


const app = express();



app.use(clerkMiddleware());

// Middleware
app.use(express.json());//adds auth object  under  the req =>request.aut
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      ENV.CLIENT_URL, // your main production URL
    ];

    if (!origin) return callback(null, true);
    
    if (origin.includes('dabarli') && origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));;//credentials : true allows the browser to send  the wookies to the server with the request

app.use("/api/inngest",serve({client:inngest, functions}));

app.use("/api/admin",adminRoutes);
app.use("/api/users",userRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/reviews",reviewRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes);

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