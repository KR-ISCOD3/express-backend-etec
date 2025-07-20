import express from 'express';
import { addClass, getClassByUserId, getInstructorDashboard, softDeleteClass, updateClass } from '../controllers/instructorController.js';
import { authenticateJWT, authorizeRole } from '../../middleware/auth.js';

const router = express.Router();

// Apply auth and role check middleware to all routes in this router
router.use(authenticateJWT);
router.use(authorizeRole('instructor'));

router.get('/', getInstructorDashboard);

// get a class by user if
router.get('/class/:userId', getClassByUserId);

// Add a class
router.post('/class', addClass);

// Update a class by ID
router.put('/class/:id', updateClass);

// Soft delete a class by ID
router.delete('/class/:id', softDeleteClass);

export default router;
