const express = require('express');
const router = express.Router();
const multer = require('multer');
const { PDFParse, VerbosityLevel } = require('pdf-parse');
const mammoth = require('mammoth');
const auth = require('../middleware/auth');
const OpenAIService = require('../services/openaiService');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.post('/analyze', auth, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let extractedText = '';
    const { mimetype, buffer } = req.file;

    if (mimetype === 'application/pdf') {
      const parser = new PDFParse({ data: buffer, verbosityLevel: VerbosityLevel.ERRORS });
      const data = await parser.getText();
      extractedText = data.text;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               mimetype === 'application/msword') {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else if (mimetype === 'text/plain') {
      extractedText = buffer.toString('utf8');
    } else {
      return res.status(400).json({ message: 'Unsupported file type' });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract text from document' });
    }

    // Limit text length for OpenAI (e.g., first 5000 characters)
    const textToAnalyze = extractedText.substring(0, 5000);
    
    try {
      const analysis = await OpenAIService.analyzeText(textToAnalyze);
      res.json(analysis);
    } catch (openAiError) {
      console.error('OpenAI Analysis Error:', openAiError);
      if (openAiError.status === 429 || openAiError.message?.includes('quota')) {
        return res.status(429).json({ 
          message: 'OpenAI Quota Exceeded. Please check your billing/credits.',
          details: openAiError.message 
        });
      }
      throw openAiError; // Re-throw to be caught by main catch block
    }
  } catch (error) {
    console.error('Document Processing Error:', error);
    res.status(500).json({ 
      message: 'Failed to process document', 
      details: error.message 
    });
  }
});


module.exports = router;
