import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { createAppointment, getUserAppointments, getAssignedAppointments, updateAppointmentStatus } from '../controllers/appointmentController.js';
const router = express.Router();
router.post('/create', verifyToken, createAppointment);
router.get('/my', verifyToken, getUserAppointments);
router.get('/assigned', verifyToken, getAssignedAppointments);
router.put('/:id/status', verifyToken, updateAppointmentStatus);
export default router;
