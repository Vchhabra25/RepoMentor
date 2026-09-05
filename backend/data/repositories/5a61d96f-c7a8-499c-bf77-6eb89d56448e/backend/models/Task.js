// backend/models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true,
  },

  topic: {
    type: String,
    required: true,
    trim: true,
  },

  time: {
    type: String,
    default: "",
  },

  // NEW FIELD → whether task is completed
  completed: {
    type: Boolean,
    default: false,
  },

  // NEW FIELD → stores when task was completed
  completedAt: {
    type: Date,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", taskSchema);
