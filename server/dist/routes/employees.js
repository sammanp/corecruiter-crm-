"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employeeController_1 = require("../controllers/employeeController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Employee CRUD operations
router.get('/', (0, auth_1.authorize)('hr', 'admin'), employeeController_1.getEmployees);
router.post('/', (0, auth_1.authorize)('hr', 'admin'), employeeController_1.createEmployee);
router.get('/stats/departments', (0, auth_1.authorize)('hr', 'admin'), employeeController_1.getDepartmentStats);
router.get('/stats/performance', (0, auth_1.authorize)('hr', 'admin'), employeeController_1.getPerformanceInsights);
router.get('/:id', (0, auth_1.authorize)('hr', 'admin', 'employee'), employeeController_1.getEmployee);
router.put('/:id', (0, auth_1.authorize)('hr', 'admin'), employeeController_1.updateEmployee);
router.delete('/:id', (0, auth_1.authorize)('hr', 'admin'), employeeController_1.deleteEmployee);
// Employee attendance and leaves
router.get('/:id/attendance', (0, auth_1.authorize)('hr', 'admin', 'employee'), employeeController_1.getEmployeeAttendance);
router.get('/:id/leaves', (0, auth_1.authorize)('hr', 'admin', 'employee'), employeeController_1.getEmployeeLeaves);
exports.default = router;
//# sourceMappingURL=employees.js.map