"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.getMe = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("../middleware/errorHandler");
const User_1 = __importDefault(require("../models/User"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || 'your-secret-key');
};
exports.register = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    // Check if user exists
    const existingUser = await User_1.default.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'User already exists'
        });
    }
    // Hash password
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(password, salt);
    // Create user
    const user = await User_1.default.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role || 'employee'
    });
    const token = generateToken(user._id.toString());
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        }
    });
});
exports.login = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide email and password'
        });
    }
    // Check if user exists
    const user = await User_1.default.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
    // Check password
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
    // Update last login
    user.lastLogin = new Date();
    user.isActive = true;
    await user.save();
    const token = generateToken(user._id.toString());
    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                lastLogin: user.lastLogin
            }
        }
    });
});
exports.logout = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    // Update user status
    await User_1.default.findByIdAndUpdate(req.user.id, {
        isActive: false
    });
    res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
});
exports.getMe = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = await User_1.default.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    });
});
exports.updateProfile = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const allowedFields = ['firstName', 'lastName', 'phone', 'avatar'];
    const updates = Object.keys(req.body)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
    }, {});
    const user = await User_1.default.findByIdAndUpdate(req.user.id, updates, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user
    });
});
exports.changePassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            message: 'Please provide current and new password'
        });
    }
    const user = await User_1.default.findById(req.user.id).select('+password');
    // Check current password
    const isCurrentPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
        return res.status(400).json({
            success: false,
            message: 'Current password is incorrect'
        });
    }
    // Hash new password
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(newPassword, salt);
    // Update password
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    });
});
//# sourceMappingURL=authController.js.map