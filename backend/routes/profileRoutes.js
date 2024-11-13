import express from 'express';
import { getProfile } from '../controllers/profileControllers.js';
import { verifyToken } from '../utils/authMiddleware.js';

const router = express.Router();

router.get('/:userid', verifyToken, getProfile);

// router.put('/:userid/update', verifyToken, updateProfile);

export default router;