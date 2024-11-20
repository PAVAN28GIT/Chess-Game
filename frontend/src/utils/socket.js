import { io } from 'socket.io-client';
import BackendURL from './config.js';

const socket = io(BackendURL, {
    withCredentials: true,
    transports: ['websocket'],
    reconnection: true,
});

socket.on('connect', () => {
    console.log("Connected to WebSocket server");
});

socket.on('disconnect', (reason) => {
    console.log('Disconnected from WebSocket server. Reason:', reason);
});



export default socket;