// Using Groq's OpenAI-compatible API via the existing 'openai' package.
// Groq free tier: 14,400 requests/day, 6,000 tokens/min — no quota issues.
// Get your free key at: https://console.groq.com
const OpenAI = require('openai');

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

// Fast, free model with strong reasoning ability
const MODEL = 'llama-3.3-70b-versatile';

// Helper: strip markdown code fences and parse JSON safely
function extractJSON(text) {
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
}

class AIService {
  async getMathSolution(question) {
    try {
      const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are a math tutor. Provide step-by-step solutions with explanations. ' +
              'Return ONLY valid JSON (no markdown fences) with exactly these keys: ' +
              'formula (string), steps (array of strings), hint (string).',
          },
          { role: 'user', content: question },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('AI Math Error:', error);
      throw error;
    }
  }

  // Returns the OpenAI-compatible stream directly — socketHandler already handles it correctly
  async chatWithAI(message, history = []) {
    try {
      const stream = await groq.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are an AI tutor for students. Be helpful, encouraging, and educational. Provide clear explanations.',
          },
          ...history,
          { role: 'user', content: message },
        ],
        stream: true,
        temperature: 0.7,
      });

      return stream;
    } catch (error) {
      console.error('AI Chat Error:', error);
      throw error;
    }
  }

  async analyzeText(text) {
    try {
      const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content:
              'Extract difficult words (7+ letters) from the text and provide simple definitions. ' +
              'Return ONLY valid JSON (no markdown fences) with a single key "words" containing an array of objects. ' +
              'Each object must have: word (string), definition (string), partOfSpeech (string).',
          },
          { role: 'user', content: text },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('AI Text Analysis Error:', error);
      throw error;
    }
  }

  async getPersonalizedRecommendations(userId, recentActivities) {
    try {
      const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content:
              'Based on the user\'s learning history, recommend 5 topics to study. ' +
              'Return ONLY valid JSON (no markdown fences) with a single key "recommendations" containing an array of objects. ' +
              'Each object must have: title, description, difficulty (Easy/Medium/Hard), estimatedTime (string like "20 min").',
          },
          { role: 'user', content: JSON.stringify(recentActivities) },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('AI Recommendations Error:', error);
      throw error;
    }
  }
}

module.exports = new AIService();