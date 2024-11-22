import express from 'express';
import { getProfile, getUser  } from '../controllers/profileControllers.js';
import { verifyToken } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:id', verifyToken, getUser);
router.get('/profile/:id', verifyToken, getProfile);

export default router;