import express from 'express';
import { authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', authorize('hr', 'admin'), (req, res) => {
  res.json({ success: true, message: 'Candidates route', data: [] });
});

export default router;
