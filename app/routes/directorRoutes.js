import express from 'express';
import { authenticateJWT, authorizeRole, authorizeOnly } from '../../middleware/auth.js';
import { sharedAction } from '../controllers/directorController.js';

const router = express.Router();

// ✅ Shared group: director and assistant
router.use(authenticateJWT, authorizeRole('director', 'assistant'));

// ✅ Shared route
router.get('/overview', sharedAction);

// ✅ Director-only route: confidential
router.get('/confidential', authorizeOnly('director'));

export default router;