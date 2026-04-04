// Load environment variables from .env file
require('dotenv').config();

// Import express (our server framework)
const express = require('express');

// Import cors (allows frontend to talk to backend)
const cors = require('cors');

// Import mongoose (connects to MongoDB)
const mongoose = require('mongoose');

// Create the express app
const app = express();

// Middleware: parse JSON + enable CORS
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// Test route — visit http://localhost:5000/ to check
app.get('/', (req, res) => {
  res.json({ message: '🚀 Dev Productivity Tracker API is running!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});