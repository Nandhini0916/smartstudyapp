const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class OpenAIService {
  async getMathSolution(question) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a math tutor. Provide step-by-step solutions with explanations. Format your response as JSON with formula, steps array, and hint."
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI Error:', error);
      throw error;
    }
  }

  async chatWithAI(message, history = []) {
    try {
      const stream = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are an AI tutor for students. Be helpful, encouraging, and educational. Provide clear explanations."
          },
          ...history,
          { role: "user", content: message }
        ],
        stream: true,
        temperature: 0.7
      });

      return stream;
    } catch (error) {
      console.error('OpenAI Chat Error:', error);
      throw error;
    }
  }

  async analyzeText(text) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "Extract difficult words (7+ letters) and provide simple definitions. Return as JSON array with word, definition, and partOfSpeech."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Text Analysis Error:', error);
      throw error;
    }
  }

  async getPersonalizedRecommendations(userId, recentActivities) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "Based on user's learning history, recommend 5 topics to study. Return as JSON array with title, description, difficulty, and estimatedTime."
          },
          {
            role: "user",
            content: JSON.stringify(recentActivities)
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Recommendations Error:', error);
      throw error;
    }
  }
}

module.exports = new OpenAIService();