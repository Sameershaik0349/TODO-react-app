// backend/server.js

require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// === IMPORT MODELS AND ROUTES ===
// We require the models here so Mongoose is aware of them before running queries
const Todo = require("./models/Todo");
const User = require("./models/User");
const authRoutes = require("./routes/auth.routes");
// ================================

// Middleware
app.use(cors());
app.use(express.json()); // Allows server to parse JSON in request body

// 1. Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connection successful."))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// NOTE: Since models are now imported from separate files (Todo.js and User.js),
// we remove the direct schema definition from this file.

// 2. Define Routes (APIs)
// ========================

// A. AUTHENTICATION ROUTES (New)
app.use("/api/auth", authRoutes);

// B. TODO CRUD ROUTES (Existing - We must now use the imported Todo model directly)
// GET all todos
app.get("/api/todos", async (req, res) => {
  // Use the imported model name (Todo) directly
  const todos = await Todo.find().sort({ timestamp: -1 });
  res.json(todos);
});

// POST a new todo
app.post("/api/todos", async (req, res) => {
  // NOTE: This POST needs modification later to associate the todo with the logged-in user ID.
  const newTodo = new Todo({
    text: req.body.text,
    user: "60c72b2f9f1b4c001c8b4567", // TEMPORARY Placeholder ID for now
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
