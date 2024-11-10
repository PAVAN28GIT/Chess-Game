import express from 'express';
import { startGame, makeMove, getGameStatus } from '../controllers/gameControllers.js';
import {verifyToken} from '../utils/authMiddleware.js';

const router = express.Router();

// Route to start a new game
router.post('/start', verifyToken, startGame);

// Route to make a move
router.post('/move', verifyToken, makeMove);

// Route to get the game status
router.get('/:gameId/status', verifyToken, getGameStatus);

export default router;
