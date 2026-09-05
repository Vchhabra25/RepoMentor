// backend/models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  groupCode: { type: String, required: true, index: true },
  author: { type: String, required: true },
  text: { type: String, required: true },
  emoji: { type: String, default: "📝" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
