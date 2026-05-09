import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { createSupportRequest, getUserRequests, getAssignedRequests, getSingleRequest } from '../controllers/supportController.js';
const router = express.Router();
router.post('/create', verifyToken, createSupportRequest);
router.get('/my-requests', verifyToken, getUserRequests);
router.get('/assigned', verifyToken, getAssignedRequests);
router.get('/:id', verifyToken, getSingleRequest);
export default router;
