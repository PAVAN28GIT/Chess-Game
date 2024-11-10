import { Router } from 'express';
import {register, login , googleAuth, googleAuthCallback } from '../controllers/authControllers.js';

const router = Router();

router.post('/register', register);
router.post('/sign-in', login);
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);

export default router;
