import express from "express";
import Reflection from "../models/Reflection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const reflections = await Reflection.find();
  res.json(reflections);
});

router.post("/", async (req, res) => {
  const { note } = req.body;
  const reflection = new Reflection({ note });
  await reflection.save();
  res.json({ message: "Reflection added", reflection });
});

export default router;
