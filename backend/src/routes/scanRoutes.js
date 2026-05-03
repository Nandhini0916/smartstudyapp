const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const OpenAI = require('openai');

// Groq client — reuse same key, different model (vision)
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

/**
 * POST /api/scan/process
 * Accepts a base64-encoded image, runs Groq vision OCR,
 * returns { extractedText, type: 'math' | 'text', mathContent }
 */
router.post('/process', auth, async (req, res) => {
  try {
    const { base64, mimeType = 'image/jpeg' } = req.body;

    if (!base64) {
      return res.status(400).json({ message: 'No image data provided' });
    }

    const completion = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are an OCR assistant for a math tutoring app.
Extract all visible text from this image exactly as written.
Then classify the content.

Return ONLY valid JSON (no markdown) with this structure:
{
  "extractedText": "<all text from the image>",
  "type": "math" or "text",
  "mathContent": "<the math expression/equation only, empty string if not math>"
}

Rules:
- type is "math" if the image contains any mathematical equation, formula, or problem (including word problems asking to solve/find/calculate)
- type is "text" if it's plain prose with no math
- mathContent should be just the equation(s), e.g. "2x + 5 = 15" or "x^2 - 5x + 6 = 0"`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const raw = completion.choices[0].message.content;
    const result = JSON.parse(raw);

    res.json({
      extractedText: result.extractedText || '',
      type: result.type || 'text',
      mathContent: result.mathContent || '',
    });
  } catch (error) {
    console.error('--- SCAN PROCESS ERROR ---');
    console.error('Status:', error.status);
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Response Data:', error.response.data);
    }
    console.error('---------------------------');

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ 
        message: 'Backend Configuration Error', 
        details: 'GROQ_API_KEY is missing in .env file' 
      });
    }

    // Friendly error for rate limits
    if (error.status === 429) {
      return res.status(429).json({ message: 'AI service is busy. Please try again in a moment.' });
    }

    // Check for Groq's 4MB limit
    if (error.message?.includes('413') || error.status === 413) {
      return res.status(413).json({ 
        message: 'Image too large', 
        details: 'Groq limit is 4MB for base64 images. Try reducing photo quality.' 
      });
    }

    res.status(500).json({ 
      message: 'AI processing failed', 
      details: error.message,
      code: error.status
    });
  }
});

module.exports = router;
