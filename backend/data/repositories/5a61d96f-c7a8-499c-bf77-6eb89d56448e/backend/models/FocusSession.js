import mongoose from "mongoose";

const focusSessionSchema = new mongoose.Schema({
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("FocusSession", focusSessionSchema);
