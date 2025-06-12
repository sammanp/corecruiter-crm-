import express from 'express';
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeAttendance,
  getEmployeeLeaves,
  getDepartmentStats,
  getPerformanceInsights
} from '../controllers/employeeController';
import { authorize } from '../middleware/auth';

const router = express.Router();

// Employee CRUD operations
router.get('/', authorize('hr', 'admin'), getEmployees);
router.post('/', authorize('hr', 'admin'), createEmployee);
router.get('/stats/departments', authorize('hr', 'admin'), getDepartmentStats);
router.get('/stats/performance', authorize('hr', 'admin'), getPerformanceInsights);
router.get('/:id', authorize('hr', 'admin', 'employee'), getEmployee);
router.put('/:id', authorize('hr', 'admin'), updateEmployee);
router.delete('/:id', authorize('hr', 'admin'), deleteEmployee);

// Employee attendance and leaves
router.get('/:id/attendance', authorize('hr', 'admin', 'employee'), getEmployeeAttendance);
router.get('/:id/leaves', authorize('hr', 'admin', 'employee'), getEmployeeLeaves);

export default router;
