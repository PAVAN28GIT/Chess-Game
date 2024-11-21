import express from 'express';
import { getProfile  } from '../controllers/profileControllers.js';
import { verifyToken } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:id', verifyToken, getProfile);
export default router;