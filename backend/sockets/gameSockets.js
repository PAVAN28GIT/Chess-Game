// socket.js
import { Chess } from 'chess.js';
import Game from '../models/gameModel.js';
import { initializeGame, makeMove, getBoardState, isGameOver, getGameResult } from '../utils/chess.js';

export default function setupGameSocket(io) {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Listen for player joining a game
        socket.on('joinGame', async (gameId, playerId) => {
            socket.join(gameId); // Join a room based on gameId
            console.log(`${playerId} joined game ${gameId}`);
            io.to(gameId).emit('playerJoined', playerId);

            // Send the initial game state to the joining player
            try {
                const game = await Game.findById(gameId).populate('player1 player2');
                if (game) {
                    socket.emit('gameState', {
                        boardState: game.boardState,
                        currentPlayer: game.currentPlayer,
                        status: game.status,
                        timers: game.timers
                    });
                }
            } catch (error) {
                socket.emit('error', 'Error fetching game data');
            }
        });

        // Listen for a move made by a player
        socket.on('makeMove', async (gameId, move, playerId) => {
            try {
                // Fetch the game details
                const game = await Game.findById(gameId);
                if (!game) {
                    return socket.emit('error', 'Game not found');
                }

                // Initialize chess instance and make the move
                const chess = new Chess(game.boardState);
                const validMove = chess.move(move);

                if (validMove) {
                    // Update game state
                    game.boardState = chess.fen();
                    game.currentPlayer = game.currentPlayer.equals(game.player1) ? game.player2 : game.player1;
                    await game.save();

                    // Broadcast the move and updated game state to both players
                    io.to(gameId).emit('moveMade', {
                        move,
                        boardState: game.boardState,
                        currentPlayer: game.currentPlayer
                    });

                    // Check if the game is over
                    if (isGameOver(chess)) {
                        const result = getGameResult(chess);
                        game.status = 'finished';
                        game.winner = result === 'checkmate' ? (game.currentPlayer.equals(game.player1) ? game.player2 : game.player1) : null;
                        await game.save();

                        io.to(gameId).emit('gameOver', { result, winner: game.winner });
                    }
                } else {
                    socket.emit('invalidMove', 'Invalid move');
                }
            } catch (error) {
                socket.emit('error', 'Error processing move');
            }
        });

        // Listen for the start of a new game
        socket.on('startGame', async (player1Id, player2Id) => {
            try {
                const chess = initializeGame(); // Initialize a new Chess.js game instance
                const newGame = new Game({
                    player1: player1Id,
                    player2: player2Id,
                    boardState: chess.fen(),
                    currentPlayer: player1Id,
                    status: 'ongoing',
                    timers: { player1: 0, player2: 0 },
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                });

                await newGame.save(); // Save the new game to the database
                socket.join(newGame._id.toString()); // Join the new game room

                // Notify both players that the game has started
                io.to(player1Id).emit('gameStarted', { gameId: newGame._id, boardState: newGame.boardState });
                io.to(player2Id).emit('gameStarted', { gameId: newGame._id, boardState: newGame.boardState });

                console.log(`Game started between ${player1Id} and ${player2Id}`);
            } catch (error) {
                socket.emit('error', 'Error starting the game');
            }
        });

        // Listen for disconnection
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
}
