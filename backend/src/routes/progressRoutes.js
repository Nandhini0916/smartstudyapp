const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Progress = require('../models/Progress');

// Get all progress for a user
router.get('/', auth, async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user._id });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update or create progress
router.post('/', auth, async (req, res) => {
  try {
    const { subject, topic, progress, score, questionsSolved, correctAnswers, timeSpent, completed } = req.body;
    
    let progressRecord = await Progress.findOne({ userId: req.user._id, subject, topic });
    
    if (progressRecord) {
      progressRecord.progress = progress !== undefined ? progress : progressRecord.progress;
      progressRecord.score = score !== undefined ? score : progressRecord.score;
      progressRecord.questionsSolved = questionsSolved !== undefined ? progressRecord.questionsSolved + questionsSolved : progressRecord.questionsSolved;
      progressRecord.correctAnswers = correctAnswers !== undefined ? progressRecord.correctAnswers + correctAnswers : progressRecord.correctAnswers;
      progressRecord.timeSpent = timeSpent !== undefined ? progressRecord.timeSpent + timeSpent : progressRecord.timeSpent;
      progressRecord.completed = completed !== undefined ? completed : progressRecord.completed;
      progressRecord.lastStudied = Date.now();
      
      await progressRecord.save();
    } else {
      progressRecord = new Progress({
        userId: req.user._id,
        subject,
        topic,
        progress: progress || 0,
        score: score || 0,
        questionsSolved: questionsSolved || 0,
        correctAnswers: correctAnswers || 0,
        timeSpent: timeSpent || 0,
        completed: completed || false
      });
      await progressRecord.save();
    }
    
    res.json(progressRecord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
