import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { addSessionNote, getSessionNotes } from '../controllers/sessionController.js';
const router = express.Router();
router.post('/notes', verifyToken, addSessionNote);
router.get('/notes/:request_id', verifyToken, getSessionNotes);
export default router;
