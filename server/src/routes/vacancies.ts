import express from 'express';
import { authorize } from '../middleware/auth';

const router = express.Router();

// Placeholder routes
router.get('/', authorize('hr', 'admin'), (req, res) => {
  res.json({ success: true, message: 'Vacancies route', data: [] });
});

export default router;
