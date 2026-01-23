import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { env, isDevelopment } from './config/env';
import { errorHandler } from './middleware/error';
import routes from './routes';

// Create Express app
const app = express();
const httpServer = createServer(app);

// Setup Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: env.FRONTEND_URL,
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (isDevelopment) {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// API Routes
app.use('/api', routes);

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });

  // Score update event
  socket.on('scoreUpdate', (data) => {
    console.log('📊 Score update:', data);
    io.emit('scoreUpdate', data);
  });

  // Match status change event
  socket.on('matchStatusChange', (data) => {
    console.log('🎮 Match status changed:', data);
    io.emit('matchStatusChange', data);
  });

  // Match winner set event
  socket.on('matchWinnerSet', (data) => {
    console.log('🏆 Match winner set:', data);
    io.emit('matchWinnerSet', data);
  });

  // Leaderboard update event
  socket.on('leaderboardUpdate', (data) => {
    console.log('🏅 Leaderboard updated:', data);
    io.emit('leaderboardUpdate', data);
  });

  // Points calculation event
  socket.on('pointsCalculated', (data) => {
    console.log('📊 Points calculated:', data);
    io.emit('pointsCalculated', data);
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
httpServer.listen(env.PORT, () => {
  console.log('🚀 Server running on http://localhost:' + env.PORT);
  console.log('🔌 Socket.io ready for connections');
  console.log('📊 Database: PostgreSQL');
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
  console.log('✅ Ready to accept requests!');
});

export { io, app };
