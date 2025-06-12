import express from 'express';
import {
  parseResume,
  matchCandidate,
  predictAttrition,
  predictPerformance,
  analyzeSentiment,
  evaluateLeave,
  getDashboardInsights
} from '../controllers/aiController';
import { authorize } from '../middleware/auth';

const router = express.Router();

// Resume parsing and matching
router.post('/parse-resume', authorize('hr', 'admin'), parseResume);
router.post('/match-candidate', authorize('hr', 'admin'), matchCandidate);

// Employee analytics
router.get('/predict-attrition/:employeeId', authorize('hr', 'admin'), predictAttrition);
router.get('/predict-performance/:employeeId', authorize('hr', 'admin'), predictPerformance);

// Sentiment analysis
router.post('/analyze-sentiment', authorize('hr', 'admin'), analyzeSentiment);

// Leave evaluation
router.get('/evaluate-leave/:leaveId', authorize('hr', 'admin'), evaluateLeave);

// Dashboard insights
router.get('/dashboard-insights', authorize('hr', 'admin'), getDashboardInsights);

export default router;
