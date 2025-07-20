import express from 'express';
import {
  getAllCourses,
} from '../controllers/courseController.js';
import { authenticateJWT } from '../../middleware/auth.js';
import { getBranches } from '../controllers/branchController.js';
import { getRoomsWithBranches } from '../controllers/roomController.js';

const router = express.Router();

// Protect routes if needed
router.use(authenticateJWT);

router.get('/courses', getAllCourses);
router.get('/branches', getBranches);
router.get('/rooms',getRoomsWithBranches);

export default router;
