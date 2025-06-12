"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const database_1 = __importDefault(require("./config/database"));
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const employees_1 = __importDefault(require("./routes/employees"));
const vacancies_1 = __importDefault(require("./routes/vacancies"));
const candidates_1 = __importDefault(require("./routes/candidates"));
const companies_1 = __importDefault(require("./routes/companies"));
const leaves_1 = __importDefault(require("./routes/leaves"));
const attendance_1 = __importDefault(require("./routes/attendance"));
const ai_1 = __importDefault(require("./routes/ai"));
const chat_1 = __importDefault(require("./routes/chat"));
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
exports.io = io;
const PORT = process.env.PORT || 5000;
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
}));
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Corecruiter CRM API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/employees', employees_1.default);
app.use('/api/vacancies', vacancies_1.default);
app.use('/api/candidates', candidates_1.default);
app.use('/api/companies', companies_1.default);
app.use('/api/leaves', leaves_1.default);
app.use('/api/attendance', attendance_1.default);
app.use('/api/ai', ai_1.default);
app.use('/api/chat', chat_1.default);
// Socket.IO for real-time features
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    // Join room based on user role/department
    socket.on('join-room', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });
    // Handle chat messages
    socket.on('send-message', (data) => {
        socket.to(data.room).emit('receive-message', data);
    });
    // Handle notifications
    socket.on('send-notification', (data) => {
        socket.to(data.room).emit('receive-notification', data);
    });
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});
// Start server
const startServer = async () => {
    try {
        await (0, database_1.default)();
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📖 API Documentation: http://localhost:${PORT}/api/health`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});
process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map