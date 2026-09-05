import express from "express";
import FocusSession from "../models/FocusSession.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const sessions = await FocusSession.find();
  res.json(sessions);
});

router.post("/", async (req, res) => {
  const { duration } = req.body;
  const session = new FocusSession({ duration });
  await session.save();
  res.json({ message: "Session added", session });
});

export default router;
