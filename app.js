const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/itemRoutes");
require("dotenv").config();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

const url = process.env.MONGODB_URI;
mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

module.exports = app;
