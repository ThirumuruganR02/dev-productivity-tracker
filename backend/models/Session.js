const mongoose = require('mongoose');

// This defines how a "coding session" is stored in MongoDB
// Think of it like a table structure in SQL
const SessionSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true  // e.g. "JavaScript", "Python"
  },
  duration: {
    type: Number,
    required: true  // in minutes
  },
  date: {
    type: Date,
    default: Date.now  // automatically saves current date
  },
  hour: {
    type: Number  // 0-23, which hour of day coding happened
  },
  project: {
    type: String,
    default: 'dev-productivity-tracker'
  }
});

module.exports = mongoose.model('Session', SessionSchema);