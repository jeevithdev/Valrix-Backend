const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/itemRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
require("dotenv").config();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/trades",tradeRoutes);

const buildMongoUri = () => {
  if (process.env.MONGO_USER && process.env.MONGO_PASS && process.env.MONGO_HOST) {
    const user = encodeURIComponent(process.env.MONGO_USER);
    const pass = encodeURIComponent(process.env.MONGO_PASS);
    const host = process.env.MONGO_HOST;
    const db = process.env.MONGO_DB || "";
    return `mongodb+srv://${user}:${pass}@${host}/${db}?retryWrites=true&w=majority`;
  }
  return process.env.MONGODB_URI;
};

const url = buildMongoUri();
if (!url) {
  console.error("MongoDB connection error: no connection string provided in env");
} else {
  mongoose
    .connect(url)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
}

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

module.exports = app;
