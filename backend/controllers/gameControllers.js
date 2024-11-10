import Game from '../models/gameModel.js';
import { Chess } from 'chess.js';

// Start a new game
export const startGame = async (req, res) => {
    try {
        const { player1Id, player2Id, timer } = req.body;

        const game = new Game({
            player1: player1Id,
            player2: player2Id,
            currentPlayer: player1Id,
            timers: { player1: timer, player2: timer },
            boardState: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        });

        await game.save();
        res.status(201).json({ message: 'Game started', gameId: game._id });
    } catch (error) {
        res.status(500).json({ error: 'Error starting game' });
    }
};

// Make a move in the game
export const makeMove = async (req, res) => {
    const { gameId, move } = req.body;

    try {
        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }
        // ches object for current game
        const chess = new Chess(game.boardState);
        const validMove = chess.move(move); // make move and check if it is valid

        if (validMove) {
            game.boardState = chess.fen(); // generate new fen string after move and update state
            game.currentPlayer = game.currentPlayer.equals(game.player1) ? game.player2 : game.player1;
            await game.save();

            res.status(200).json({ message: 'Move made', boardState: game.boardState });
        } else {
            res.status(400).json({ error: 'Invalid move' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error making move' });
    }
};

// Get game status
export const getGameStatus = async (req, res) => {
    const { gameId } = req.params;

    try {
        const game = await Game.findById(gameId).populate('player1 player2');
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.status(200).json({
            boardState: game.boardState,
            currentPlayer: game.currentPlayer,
            status: game.status,
            winner: game.winner,
            timers: game.timers
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching game status' });
    }
};

// using chess.js library to get game result
export const getGameResult = (chessInstance) => {
    if (chessInstance.isCheckmate()) return 'checkmate';
    if (chessInstance.isStalemate()) return 'stalemate';
    if (chessInstance.isDraw()) return 'draw';
    return null;
};