const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Vocabulary = require('../models/Vocabulary');
const OpenAIService = require('../services/openaiService');

// Get all vocabulary for a user
router.get('/', auth, async (req, res) => {
  try {
    const vocab = await Vocabulary.find({ userId: req.user._id });
    res.json(vocab);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new vocabulary word
router.post('/', auth, async (req, res) => {
  try {
    const { word, definition, partOfSpeech, example, difficulty } = req.body;
    
    const newVocab = new Vocabulary({
      userId: req.user._id,
      word,
      definition,
      partOfSpeech,
      example,
      difficulty
    });
    
    await newVocab.save();
    res.status(201).json(newVocab);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Word already exists in vocabulary' });
    }
    res.status(500).json({ message: err.message });
  }
});

// Update review status
router.put('/:id/review', auth, async (req, res) => {
  try {
    const { mastered } = req.body;
    const vocab = await Vocabulary.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!vocab) {
      return res.status(404).json({ message: 'Vocabulary not found' });
    }
    
    vocab.reviewCount += 1;
    vocab.lastReviewed = Date.now();
    if (mastered !== undefined) vocab.mastered = mastered;
    
    await vocab.save();
    res.json(vocab);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Analyze text
router.post('/analyze-text', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });
    
    const analysis = await OpenAIService.analyzeText(text);
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
