import { Router } from 'express';
import {register, login , googleAuth, googleAuthCallback } from '../controllers/authControllers.js';
import { verifyToken } from '../Middlewares/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/sign-in', login);
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);

router.get('/check-auth' , verifyToken , (req, res) => {   
    res.json(req.user);
});

export default router;
