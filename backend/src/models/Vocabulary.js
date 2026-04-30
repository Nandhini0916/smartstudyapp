const mongoose = require('mongoose');

const vocabularySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  word: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  definition: {
    type: String,
    required: true
  },
  partOfSpeech: {
    type: String,
    enum: ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction'],
    default: 'noun'
  },
  example: {
    type: String,
    default: ''
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  lastReviewed: {
    type: Date,
    default: Date.now
  },
  mastered: {
    type: Boolean,
    default: false
  },
  addedDate: {
    type: Date,
    default: Date.now
  }
});

vocabularySchema.index({ userId: 1, word: 1 }, { unique: true });

module.exports = mongoose.model('Vocabulary', vocabularySchema);