import express from 'express';

const router = express.Router();

router.get('/reconnect', reconnectPlayer);

export default router;
