import mongoose from "mongoose";

const reflectionSchema = new mongoose.Schema({
  note: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Reflection", reflectionSchema);
