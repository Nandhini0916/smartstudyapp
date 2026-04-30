const OpenAIService = require('../services/openaiService');

module.exports = (io) => {
  const userSessions = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-tutor', (userId) => {
      userSessions.set(userId, socket.id);
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined tutor session`);
    });

    socket.on('math-query', async (data, callback) => {
      const { userId, query } = data;
      
      try {
        // Emit processing status
        socket.emit('math-processing', { status: 'processing' });
        
        // Get AI solution
        const solution = await OpenAIService.getMathSolution(query);
        
        // Emit step-by-step in real-time
        if (solution.steps && solution.steps.length > 0) {
          for (let i = 0; i < solution.steps.length; i++) {
            socket.emit('math-step', {
              step: i + 1,
              content: solution.steps[i],
              total: solution.steps.length
            });
            // Add delay between steps for better UX
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        
        // Send complete solution
        socket.emit('math-complete', solution);
        
        if (callback) callback({ success: true, solution });
      } catch (error) {
        socket.emit('math-error', { message: error.message });
        if (callback) callback({ success: false, error: error.message });
      }
    });

    socket.on('ai-chat', async (data) => {
      const { userId, message, history } = data;
      
      try {
        const stream = await OpenAIService.chatWithAI(message, history);
        
        let fullResponse = '';
        
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            fullResponse += content;
            // Stream each word/token
            socket.emit('ai-chunk', { chunk: content, full: fullResponse });
          }
        }
        
        socket.emit('ai-complete', { response: fullResponse });
      } catch (error) {
        socket.emit('ai-error', { message: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      for (const [userId, socketId] of userSessions.entries()) {
        if (socketId === socket.id) {
          userSessions.delete(userId);
          break;
        }
      }
    });
  });
};