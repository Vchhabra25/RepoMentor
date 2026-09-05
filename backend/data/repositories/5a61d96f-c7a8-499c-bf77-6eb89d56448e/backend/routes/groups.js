const express = require("express");
const Group = require("../models/Group");
const Message = require("../models/Message");

const router = express.Router();

function randomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// CREATE GROUP
router.post("/create", async (req, res) => {
  try {
    const { name, creatorName } = req.body;

    const group = await Group.create({
      name,
      code: randomCode(),
      members: [{ name: creatorName, focusMinutes: 0 }],
    });

    res.json({ ok: true, group });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

// JOIN GROUP
router.post("/join", async (req, res) => {
  try {
    const { code, name } = req.body;

    const group = await Group.findOne({ code });
    if (!group) return res.status(404).json({ ok: false, error: "Invalid code" });

    // add member only if not exists
    if (!group.members.find((m) => m.name === name)) {
      group.members.push({ name, focusMinutes: 0 });
      await group.save();
    }

    res.json({ ok: true, group });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

// GET GROUP
router.get("/:code", async (req, res) => {
  try {
    const group = await Group.findOne({ code: req.params.code });
    res.json({ ok: true, group });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

// GET MESSAGES
router.get("/:code/messages", async (req, res) => {
  try {
    const messages = await Message.find({ groupCode: req.params.code }).sort({
      createdAt: 1,
    });
    res.json({ ok: true, messages });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

// SEND MESSAGE
router.post("/:code/messages", async (req, res) => {
  try {
    const msg = await Message.create({
      groupCode: req.params.code,
      author: req.body.author,
      text: req.body.text,
      emoji: req.body.emoji || "",
    });
    res.json({ ok: true, msg });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

// UPDATE MEMBER FOCUS TIME
router.post("/:code/member/focus", async (req, res) => {
  try {
    const { name, addMinutes } = req.body;

    const group = await Group.findOne({ code: req.params.code });
    if (!group) return res.status(404).json({ ok: false });

    const member = group.members.find((m) => m.name === name);
    if (member) {
      member.focusMinutes += addMinutes;
      await group.save();
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

module.exports = router;
