import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { submitFeedback, getFeedback } from '../controllers/feedbackController.js';
const router = express.Router();
router.post('/create', verifyToken, submitFeedback);
router.get('/', verifyToken, requireRole('admin'), getFeedback);
export default router;
