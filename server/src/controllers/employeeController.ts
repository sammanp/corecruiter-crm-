import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import Employee from '../models/Employee';
import Attendance from '../models/Attendance';
import Leave from '../models/Leave';
import { AuthRequest } from '../middleware/auth';

// Get all employees
export const getEmployees = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    page = 1,
    limit = 10,
    search,
    department,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter: any = {};
  
  if (search) {
    filter.$or = [
      { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
      { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
      { 'personalInfo.email': { $regex: search, $options: 'i' } },
      { employeeId: { $regex: search, $options: 'i' } }
    ];
  }

  if (department) {
    filter['jobInfo.department'] = department;
  }

  if (status) {
    filter.status = status;
  }

  // Pagination
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  // Sort
  const sort: any = {};
  sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

  const employees = await Employee.find(filter)
    .populate('jobInfo.manager', 'personalInfo.firstName personalInfo.lastName')
    .sort(sort)
    .skip(skip)
    .limit(limitNum)
    .select('-documents'); // Exclude sensitive documents

  const total = await Employee.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: employees,
    pagination: {
      current: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
      limit: limitNum
    }
  });
});

// Get single employee
export const getEmployee = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const employee = await Employee.findById(id)
    .populate('jobInfo.manager', 'personalInfo.firstName personalInfo.lastName personalInfo.email');

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }

  res.status(200).json({
    success: true,
    data: employee
  });
});

// Create new employee
export const createEmployee = asyncHandler(async (req: AuthRequest, res: Response) => {
  const employeeData = req.body;

  // Generate employee ID if not provided
  if (!employeeData.employeeId) {
    const count = await Employee.countDocuments();
    employeeData.employeeId = `EMP${String(count + 1).padStart(4, '0')}`;
  }

  const employee = await Employee.create(employeeData);

  res.status(201).json({
    success: true,
    message: 'Employee created successfully',
    data: employee
  });
});

// Update employee
export const updateEmployee = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const employee = await Employee.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  );

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Employee updated successfully',
    data: employee
  });
});

// Delete employee (soft delete)
export const deleteEmployee = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const employee = await Employee.findByIdAndUpdate(
    id,
    { status: 'terminated' },
    { new: true }
  );

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Employee deactivated successfully'
  });
});

// Get employee attendance
export const getEmployeeAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { startDate, endDate, page = 1, limit = 10 } = req.query;

  // Build date filter
  const dateFilter: any = { employee: id };
  if (startDate || endDate) {
    dateFilter.date = {};
    if (startDate) dateFilter.date.$gte = new Date(startDate as string);
    if (endDate) dateFilter.date.$lte = new Date(endDate as string);
  }

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const attendance = await Attendance.find(dateFilter)
    .sort({ date: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Attendance.countDocuments(dateFilter);

  // Calculate summary statistics
  const summary = await Attendance.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: null,
        totalDays: { $sum: 1 },
        presentDays: {
          $sum: {
            $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
          }
        },
        absentDays: {
          $sum: {
            $cond: [{ $eq: ['$status', 'absent'] }, 1, 0]
          }
        },
        lateDays: {
          $sum: {
            $cond: [{ $eq: ['$status', 'late'] }, 1, 0]
          }
        },
        totalHours: { $sum: '$totalHours' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      attendance,
      summary: summary[0] || {
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        lateDays: 0,
        totalHours: 0
      }
    },
    pagination: {
      current: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
      limit: limitNum
    }
  });
});

// Get employee leaves
export const getEmployeeLeaves = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, year, page = 1, limit = 10 } = req.query;

  // Build filter
  const filter: any = { employee: id };
  if (status) filter.status = status;
  if (year) {
    const startOfYear = new Date(`${year}-01-01`);
    const endOfYear = new Date(`${year}-12-31`);
    filter.startDate = { $gte: startOfYear, $lte: endOfYear };
  }

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const leaves = await Leave.find(filter)
    .populate('approvedBy', 'firstName lastName')
    .sort({ appliedDate: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Leave.countDocuments(filter);

  // Calculate leave summary
  const summary = await Leave.aggregate([
    { $match: { employee: id, status: 'approved' } },
    {
      $group: {
        _id: '$leaveType',
        totalDays: { $sum: '$totalDays' },
        count: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      leaves,
      summary
    },
    pagination: {
      current: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
      limit: limitNum
    }
  });
});

// Get department statistics
export const getDepartmentStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const stats = await Employee.aggregate([
    {
      $match: { status: 'active' }
    },
    {
      $group: {
        _id: '$jobInfo.department',
        count: { $sum: 1 },
        avgSalary: { $avg: '$jobInfo.salary.amount' },
        avgRating: { $avg: '$performance.currentRating' },
        avgAttritionRisk: { $avg: '$aiAnalytics.attritionRisk' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  res.status(200).json({
    success: true,
    data: stats
  });
});

// Get performance insights
export const getPerformanceInsights = asyncHandler(async (req: AuthRequest, res: Response) => {
  const insights = await Employee.aggregate([
    {
      $match: { status: 'active' }
    },
    {
      $group: {
        _id: null,
        totalEmployees: { $sum: 1 },
        avgPerformance: { $avg: '$performance.currentRating' },
        highPerformers: {
          $sum: {
            $cond: [{ $gte: ['$performance.currentRating', 8] }, 1, 0]
          }
        },
        lowPerformers: {
          $sum: {
            $cond: [{ $lt: ['$performance.currentRating', 5] }, 1, 0]
          }
        },
        highAttritionRisk: {
          $sum: {
            $cond: [{ $gte: ['$aiAnalytics.attritionRisk', 0.7] }, 1, 0]
          }
        },
        avgTenure: {
          $avg: {
            $divide: [
              { $subtract: [new Date(), '$jobInfo.joinDate'] },
              365 * 24 * 60 * 60 * 1000 // Convert to years
            ]
          }
        }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: insights[0] || {}
  });
});
