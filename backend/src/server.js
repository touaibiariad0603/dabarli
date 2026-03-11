import express from "express";

const app = express();

app.use(express.json());

// Friendly root route
app.get("/", (req, res) => {
  res.send("Dabarli Backend is running!");
});

// API routes
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "success" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("server is up and running");
});