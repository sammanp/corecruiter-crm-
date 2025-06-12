"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aiController_1 = require("../controllers/aiController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Resume parsing and matching
router.post('/parse-resume', (0, auth_1.authorize)('hr', 'admin'), aiController_1.parseResume);
router.post('/match-candidate', (0, auth_1.authorize)('hr', 'admin'), aiController_1.matchCandidate);
// Employee analytics
router.get('/predict-attrition/:employeeId', (0, auth_1.authorize)('hr', 'admin'), aiController_1.predictAttrition);
router.get('/predict-performance/:employeeId', (0, auth_1.authorize)('hr', 'admin'), aiController_1.predictPerformance);
// Sentiment analysis
router.post('/analyze-sentiment', (0, auth_1.authorize)('hr', 'admin'), aiController_1.analyzeSentiment);
// Leave evaluation
router.get('/evaluate-leave/:leaveId', (0, auth_1.authorize)('hr', 'admin'), aiController_1.evaluateLeave);
// Dashboard insights
router.get('/dashboard-insights', (0, auth_1.authorize)('hr', 'admin'), aiController_1.getDashboardInsights);
exports.default = router;
//# sourceMappingURL=ai.js.map