require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const tasksRouter = require("./routes/tasks");
const groupsRouter = require("./routes/groups");
const aiRouter = require("./routes/ai");

const app = express();

// ---------- CORS ----------
app.use(cors({
  origin: [
    "https://elevate-frontend-ebon.vercel.app",
    "https://elevate-frontend-git-main-vanshikas-projects-e187c0da.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());

// ---------- MongoDB ----------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// ---------- API ROUTES ----------
app.use("/tasks", tasksRouter);
app.use("/groups", groupsRouter);
app.use("/ai", aiRouter);

// ---------- Base Route ----------
app.get("/", (req, res) => {
  res.send("🌟 Elevate Backend is Running — AI, Groups & Tasks API Active");
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on Render at port ${PORT}`)
);

// ---------- Prevent Render Free Tier Sleep ----------
setInterval(() => {
  fetch("https://elevate-e1yu.onrender.com/")
    .then(() => console.log("🔁 Self-ping to keep backend awake"))
    .catch(() => {});
}, 10000); // every 10 sec
