import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from "passport";

// Database Connection
import connectDB from './database/connect.js';

//routes
import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js';

// Passport Config
import './config/passport.js';

dotenv.config();

// Create an Express app
const app = express();

// Create an HTTP server with Express
const server = createServer(app);

// Initialize Socket.IO with the HTTP server
const io = new Server(server);

lk
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Database Connection
connectDB();

// cors is used to whitelist only frontend url and blacklist all ohter urls for securty reasons 
app.use(cors({
    origin: process.env.FRONTEND_URL, // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
}));

app.get('/', (req, res) => {
    res.send('Backend API is running....');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);


app.listen(8000, () => {
    console.log('Server started on port 8000');
});