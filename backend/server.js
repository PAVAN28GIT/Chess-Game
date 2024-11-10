import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';

// Database Connection
import connectDB from './database/connect.js';

//routes
import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js';

// Game Socket
import setupGameSocket from './sockets/gameSockets.js';

// Passport Config
import './config/passport.js';


dotenv.config();


const app = express();  // Create an express app
const server = http.createServer(app);  // Create HTTP server using express app
// Initialize Socket.io with the HTTP server
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,  // Allow only your frontend URL for security
        methods: ['GET', 'POST'],
        credentials: true,
    }
});
// Setup WebSocket for game events
setupGameSocket(io);  // Pass the socket.io instance to the function

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());


// Database Connection
connectDB();

// app.use(cors({
//     origin: process.env.FRONTEND_URL, // Replace with your frontend URL
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true 
// }));

app.get('/', (req, res) => {
    res.send('Backend API is running....');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);


app.listen(8000, () => {
    console.log('Server started on port 8000');
});