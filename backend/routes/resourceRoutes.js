import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { createResource, getResources } from '../controllers/resourceController.js';
const router = express.Router();
router.get('/', verifyToken, getResources);
router.post('/', verifyToken, requireRole('admin', 'selfcare'), createResource);
export default router;
