import express from 'express';
import connectDB from './database/connect.js';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import passport from "passport";
import './config/passport.js';


dotenv.config();
const app = express();

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


app.listen(8000, () => {
    console.log('Server started on port 8000');
});