// backend/models/Group.js
const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, default: "Study Group" },
  members: [
    {
      name: String,
      joinedAt: { type: Date, default: Date.now },
      focusMinutes: { type: Number, default: 0 }, // local tracked minutes for this user in group
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Group", groupSchema);
