import express from 'express';
import { authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', authorize('hr', 'admin', 'employee'), (req, res) => {
  res.json({ success: true, message: 'Attendance route', data: [] });
});

export default router;
