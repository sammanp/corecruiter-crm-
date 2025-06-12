const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    methods: ["GET", "POST"]
  }
});

const PORT = 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.status(200).json({
    status: 'OK',
    message: 'Corecruiter CRM API is running (Demo Mode)',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ 
    success: true,
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Mock AI insights endpoint
app.get('/api/ai/insights', (req, res) => {
  console.log('AI insights requested');
  res.json({
    success: true,
    data: [
      {
        title: "Server Connected Successfully",
        description: "Backend API is now responding to requests",
        type: "success",
        confidence: 100
      }
    ]
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message  });
});

// Socket.IO for real-time features
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // Join room based on user role/department
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`🏠 User ${socket.id} joined room: ${room}`);
  });

  // Handle chat messages
  socket.on('send-message', (data) => {
    console.log('📨 Message sent:', data);
    socket.to(data.room).emit('receive-message', {
      ...data,
      timestamp: new Date().toISOString()
    });
  });

  // Handle notifications
  socket.on('send-notification', (data) => {
    console.log('🔔 Notification sent:', data);
    socket.to(data.room).emit('receive-notification', {
      ...data,
      timestamp: new Date().toISOString()
    });
  });

  // Simulate system events
  setTimeout(() => {
    socket.emit('receive-notification', {
      id: Date.now().toString(),
      title: 'Welcome to Corecruiter',
      message: 'Real-time notifications are now active!',
      type: 'success',
      timestamp: new Date().toISOString()
    });
  }, 2000);

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Demo Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`💡 Demo mode: Simplified server for frontend testing`);
});
