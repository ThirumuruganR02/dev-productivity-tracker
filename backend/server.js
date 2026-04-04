require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// Routes
const sessionsRouter = require('./routes/sessions');
app.use('/api/sessions', sessionsRouter);

const githubRouter = require('./routes/github');
app.use('/api/github', githubRouter);

app.get('/', (req, res) => {
  res.json({ message: '🚀 Dev Productivity Tracker API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});