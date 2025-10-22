// backend/server.js

require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// === IMPORT MODELS AND ROUTES ===
// Ensure these imports are correct. They must point to the files you created.
const Todo = require("./models/Todo");
const User = require("./models/User");
const authRoutes = require("./routes/auth.routes");
// ================================

// Middleware
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connection successful."))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// 2. Define Routes (APIs)
// ========================

// A. AUTHENTICATION ROUTES
app.use("/api/auth", authRoutes);

// B. TODO CRUD ROUTES (Now protected, but we keep the logic here)
// GET all todos
// NOTE: This route should eventually be protected by JWT middleware
app.get("/api/todos", async (req, res) => {
  // Use the imported Todo model
  const todos = await Todo.find().sort({ timestamp: -1 });
  res.json(todos);
});

// POST a new todo
// NOTE: Must be protected and use the user's ID
app.post("/api/todos", async (req, res) => {
  // We're using a placeholder ID for now until we implement JWT middleware
  const newTodo = new Todo({
    text: req.body.text,
    userId: "60c72b2f9f1b4c001c8b4567", // Replace with a valid ObjectId from your DB or remove
  });
  await newTodo.save();
  res.json(newTodo);
});

// PUT/Toggle todo completion
app.put("/api/todos/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (todo) {
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } else {
    res.status(404).send("Todo not found");
  }
});

// DELETE a todo
app.delete("/api/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Todo deleted" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
