import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Corecruiter CRM API is running (Demo Mode)',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Basic demo endpoints
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💡 Demo mode: Simplified server for testing`);
});
