// frontend/src/App.jsx (Updated with Navbar)

import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");

  // --- CRUD Operations (Logic remains the same) ---
  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    try {
      const response = await axios.post(API_URL, { text: newTodoText });
      setTodos([response.data, ...todos]);
      setNewTodoText("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`);
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };
  // --- END CRUD Operations ---

  return (
    <>
      {/* 1. NAVIGATION BAR (The new addition) */}
      <nav className="fixed top-0 left-0 w-full bg-gray-900 shadow-xl z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-white tracking-widest">
                <span className="text-accent">T</span>ODO
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. MAIN CONTENT CONTAINER */}
      {/* The 'pt-16' (padding-top: 4rem) ensures content starts below the fixed navbar */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex justify-center items-center p-4 pt-16">
        {/* Todo Card: polished dark-mode styling */}
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
          <h1 className="text-4xl font-extrabold text-white mb-8 text-center tracking-wider">
            <span className="text-accent">MERN</span> Tasks
          </h1>

          {/* Input Form with Stylish Button */}
          <form onSubmit={addTodo} className="flex gap-3 mb-8">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add a new task..."
              className="flex-grow p-3 rounded-lg border-2 border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-accent transition duration-200"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-accent text-gray-900 font-bold rounded-lg hover:bg-opacity-90 transition duration-300 shadow-lg shadow-accent/40 hover:shadow-accent/60"
            >
              Add
            </button>
          </form>

          {/* Todo List Display */}
          <ul className="space-y-4">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className={`flex justify-between items-center p-4 rounded-xl border-l-4 transition duration-300 shadow-md transform hover:scale-[1.01]
                  ${
                    todo.completed
                      ? "bg-gray-700 border-green-500"
                      : "bg-gray-700 border-accent hover:bg-gray-600"
                  }`}
              >
                {/* Task Text and Toggle */}
                <span
                  onClick={() => toggleTodo(todo._id)}
                  className={`flex-grow cursor-pointer text-lg transition duration-200 
                    ${
                      todo.completed
                        ? "text-gray-400 line-through italic"
                        : "text-white font-medium"
                    }`}
                >
                  {todo.text}
                </span>

                {/* Delete Button */}
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="text-red-500 hover:text-red-400 text-xl font-medium ml-4 p-1 rounded-full hover:bg-gray-700 transition duration-200"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
          {todos.length === 0 && (
            <p className="text-center text-gray-500 mt-6 italic">
              No tasks found. Get organized!
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
