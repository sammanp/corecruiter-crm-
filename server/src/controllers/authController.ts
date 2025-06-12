import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { asyncHandler } from '../middleware/errorHandler';
import User, { IUser } from '../models/User';
import { AuthRequest } from '../middleware/auth';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key');
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, role } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: role || 'employee'
  });
  const token = generateToken((user._id as string).toString());

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

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  // Check if user exists
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
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
  const token = generateToken((user._id as string).toString());

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

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Update user status
  await User.findByIdAndUpdate(req.user.id, {
    isActive: false
  });

  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const allowedFields = ['firstName', 'lastName', 'phone', 'avatar'];
  const updates = Object.keys(req.body)
    .filter(key => allowedFields.includes(key))
    .reduce((obj: any, key) => {
      obj[key] = req.body[key];
      return obj;
    }, {});

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide current and new password'
    });
  }

  const user = await User.findById(req.user.id).select('+password');
  
  // Check current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user!.password);
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password
  user!.password = hashedPassword;
  await user!.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});
