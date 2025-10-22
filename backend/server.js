// backend/server.js

require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows server to parse JSON in request body

// 1. Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connection successful."))
  .catch((err) => console.error("MongoDB connection error:", err));

// 2. Define Schema and Model
const TodoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});
const Todo = mongoose.model("Todo", TodoSchema);

// 3. Define Routes (APIs)
// GET all todos
app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find().sort({ timestamp: -1 });
  res.json(todos);
});

// POST a new todo
app.post("/api/todos", async (req, res) => {
  const newTodo = new Todo({ text: req.body.text });
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
  console.log(`Server running on port ${PORT}`);
});
