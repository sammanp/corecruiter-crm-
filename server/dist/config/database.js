"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/corecruiter-crm';
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error('❌ Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await mongoose_1.default.disconnect();
        console.log('📦 MongoDB Disconnected');
    }
    catch (error) {
        console.error('❌ Error disconnecting from MongoDB:', error);
    }
};
exports.disconnectDB = disconnectDB;
// Mongoose connection events
mongoose_1.default.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to MongoDB');
});
mongoose_1.default.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err);
});
mongoose_1.default.connection.on('disconnected', () => {
    console.log('📦 Mongoose disconnected');
});
exports.default = exports.connectDB;
//# sourceMappingURL=database.js.map