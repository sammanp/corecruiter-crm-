"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPerformanceInsights = exports.getDepartmentStats = exports.getEmployeeLeaves = exports.getEmployeeAttendance = exports.deleteEmployee = exports.updateEmployee = exports.createEmployee = exports.getEmployee = exports.getEmployees = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const Employee_1 = __importDefault(require("../models/Employee"));
const Attendance_1 = __importDefault(require("../models/Attendance"));
const Leave_1 = __importDefault(require("../models/Leave"));
// Get all employees
exports.getEmployees = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { page = 1, limit = 10, search, department, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    // Build filter object
    const filter = {};
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
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    const employees = await Employee_1.default.find(filter)
        .populate('jobInfo.manager', 'personalInfo.firstName personalInfo.lastName')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .select('-documents'); // Exclude sensitive documents
    const total = await Employee_1.default.countDocuments(filter);
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
exports.getEmployee = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const employee = await Employee_1.default.findById(id)
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
exports.createEmployee = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const employeeData = req.body;
    // Generate employee ID if not provided
    if (!employeeData.employeeId) {
        const count = await Employee_1.default.countDocuments();
        employeeData.employeeId = `EMP${String(count + 1).padStart(4, '0')}`;
    }
    const employee = await Employee_1.default.create(employeeData);
    res.status(201).json({
        success: true,
        message: 'Employee created successfully',
        data: employee
    });
});
// Update employee
exports.updateEmployee = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const employee = await Employee_1.default.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });
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
exports.deleteEmployee = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const employee = await Employee_1.default.findByIdAndUpdate(id, { status: 'terminated' }, { new: true });
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
exports.getEmployeeAttendance = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { startDate, endDate, page = 1, limit = 10 } = req.query;
    // Build date filter
    const dateFilter = { employee: id };
    if (startDate || endDate) {
        dateFilter.date = {};
        if (startDate)
            dateFilter.date.$gte = new Date(startDate);
        if (endDate)
            dateFilter.date.$lte = new Date(endDate);
    }
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const attendance = await Attendance_1.default.find(dateFilter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await Attendance_1.default.countDocuments(dateFilter);
    // Calculate summary statistics
    const summary = await Attendance_1.default.aggregate([
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
exports.getEmployeeLeaves = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { status, year, page = 1, limit = 10 } = req.query;
    // Build filter
    const filter = { employee: id };
    if (status)
        filter.status = status;
    if (year) {
        const startOfYear = new Date(`${year}-01-01`);
        const endOfYear = new Date(`${year}-12-31`);
        filter.startDate = { $gte: startOfYear, $lte: endOfYear };
    }
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const leaves = await Leave_1.default.find(filter)
        .populate('approvedBy', 'firstName lastName')
        .sort({ appliedDate: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await Leave_1.default.countDocuments(filter);
    // Calculate leave summary
    const summary = await Leave_1.default.aggregate([
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
exports.getDepartmentStats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const stats = await Employee_1.default.aggregate([
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
exports.getPerformanceInsights = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const insights = await Employee_1.default.aggregate([
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
//# sourceMappingURL=employeeController.js.map