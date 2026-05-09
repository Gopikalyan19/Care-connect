import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { assignSelfcarePlan, getMySelfcarePlans } from '../controllers/selfcareController.js';
const router = express.Router();
router.post('/plans', verifyToken, assignSelfcarePlan);
router.get('/my-plans', verifyToken, getMySelfcarePlans);
export default router;
