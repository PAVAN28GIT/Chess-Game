import express from 'express';
import { getProfile , getGames } from '../controllers/profileControllers.js';
import { verifyToken } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:userid', verifyToken, getProfile);
router.get('/games', verifyToken, getGames);

export default router;