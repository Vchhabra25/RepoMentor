const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

function reply(text) {
  return "🤖 StudyBot: " + text;
}

router.get("/suggestion", async (req, res) => {
  try {
    const tasks = await Task.find();
    const count = tasks.length;

    if (count === 0)
      return res.json({ reply: reply("No tasks yet — add your first one!") });

    const msg = `You have ${count} tasks. Start with the hardest one and try a 25-minute sprint.`;
    res.json({ reply: reply(msg) });
  } catch {
    res.status(500).json({ reply: reply("Error analyzing tasks.") });
  }
});

router.post("/reflection/analyze", (req, res) => {
  const { text } = req.body;
  if (!text) return res.json({ reply: reply("Write something first.") });

  if (text.includes("tired"))
    return res.json({ reply: reply("Rest a bit! Short breaks boost memory.") });

  if (text.includes("distract"))
    return res.json({ reply: reply("Try a 5-minute breathing reset.") });

  res.json({ reply: reply("Good reflection! Stay consistent.") });
});

module.exports = router;
