import express from 'express';
import { addClass, getInstructorDashboard, softDeleteClass, updateClass } from '../controllers/instructorController.js';
import { authenticateJWT, authorizeRole } from '../../middleware/auth.js';

const router = express.Router();

// Apply auth and role check middleware to all routes in this router
router.use(authenticateJWT);
router.use(authorizeRole('instructor'));

router.get('/', getInstructorDashboard);

// Add a class
router.post('/', addClass);

// Update a class by ID
router.put('/:id', updateClass);

// Soft delete a class by ID
router.delete('/:id', softDeleteClass);

export default router;
