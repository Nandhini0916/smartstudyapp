require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const connectDB = require('./config/database');

const app = express();
const httpServer = createServer(app);

// Connect to MongoDB
connectDB();

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:8081',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const progressRoutes = require('./routes/progressRoutes');
const vocabularyRoutes = require('./routes/vocabularyRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/vocabulary', vocabularyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Socket.io handlers
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('math-query', async (data) => {
    try {
      // Simulate processing time
      setTimeout(() => {
        socket.emit('math-solution', {
          solution: `Solution for: ${data.problem}\n\n📐 Step 1: Analyze the problem\n🔢 Step 2: Apply relevant formulas\n📝 Step 3: Calculate step by step\n\n✨ Answer: (Simulated response from backend)`
        });
      }, 1500);
    } catch (error) {
      socket.emit('error', { message: 'Failed to process math problem' });
    }
  });

  socket.on('chat-message', async (data) => {
    try {
      // Simulate AI typing delay
      setTimeout(() => {
        socket.emit('chat-response', {
          id: Date.now().toString(),
          text: `You said: "${data.message}". This is a response from the backend AI tutor module.`,
          isUser: false
        });
      }, 1000);
    } catch (error) {
      socket.emit('error', { message: 'Failed to process chat message' });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});