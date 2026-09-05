const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

/* ---------------------------------------
   GET ALL TASKS → separated by status
---------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const active = await Task.find({ completed: false }).sort({ createdAt: -1 });
    const completed = await Task.find({ completed: true }).sort({ completedAt: -1 });

    res.json({
      activeTasks: active,
      completedTasks: completed,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

/* ---------------------------------------
   CREATE TASK
---------------------------------------- */
router.post("/", async (req, res) => {
  try {
    const newTask = new Task({
      subject: req.body.subject,
      topic: req.body.topic,
      time: req.body.time,
    });

    await newTask.save();
    res.json({ message: "Task added", task: newTask });
  } catch (err) {
    res.status(500).json({ message: "Error adding task" });
  }
});

/* ---------------------------------------
   MARK TASK AS COMPLETED
---------------------------------------- */
router.put("/:id/complete", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: true, completedAt: new Date() },
      { new: true }
    );

    res.json({ message: "Task marked as completed", task: updated });
  } catch (err) {
    res.status(500).json({ message: "Error completing task" });
  }
});

/* ---------------------------------------
   UNDO COMPLETED TASK
---------------------------------------- */
router.put("/:id/undo", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: false, completedAt: null },
      { new: true }
    );

    res.json({ message: "Task restored", task: updated });
  } catch (err) {
    res.status(500).json({ message: "Error restoring task" });
  }
});

/* ---------------------------------------
   DELETE TASK
---------------------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

module.exports = router;
