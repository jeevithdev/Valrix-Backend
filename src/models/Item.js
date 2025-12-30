const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    enum: ["New", "Old", "Used", "Damaged"],
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  images: {
    type: [String],
  },
  status: {
    type: String,
    enum: ["available", "traded"],
    default:"available",
    required: true,
  },
  createdAt:{
    type:Date,
    default:Date.now
  }
});

module.exports = mongoose.model("Item", itemSchema);
