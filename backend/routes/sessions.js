const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

// POST /api/sessions — Save a new coding session
// This is called when you log coding time
router.post('/', async (req, res) => {
  try {
    const session = new Session({
      language: req.body.language,
      duration: req.body.duration,
      hour: new Date().getHours(),
      project: req.body.project
    });
    await session.save();
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sessions — Get all coding sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sessions/stats — Get productivity stats
router.get('/stats', async (req, res) => {
  try {
    const sessions = await Session.find();

    // Total coding time
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);

    // Most used language
    const langCount = {};
    sessions.forEach(s => {
      langCount[s.language] = (langCount[s.language] || 0) + s.duration;
    });
    const topLanguage = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Most productive hour
    const hourCount = {};
    sessions.forEach(s => {
      hourCount[s.hour] = (hourCount[s.hour] || 0) + s.duration;
    });
    const topHour = Object.entries(hourCount)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    res.json({
      totalMinutes,
      totalHours: (totalMinutes / 60).toFixed(1),
      topLanguage,
      topHour: `${topHour}:00`,
      totalSessions: sessions.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;