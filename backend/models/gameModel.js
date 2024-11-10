const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    player1: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Player 1
    player2: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Player 2

    boardState: { 
        type: String, 
        default: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"  // FEN string
    },
    
    currentPlayer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
    status: { 
        type: String, 
        enum: ['waiting', 'ongoing', 'finished'], 
        default: 'waiting' 
    },

    winner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        default: null 
    },

    timers: {
        player1: { type: Number, required: true },  // Player 1's time
        player2: { type: Number, required: true },  // Player 2's time
    },

    createdAt: { type: Date, default: Date.now },  // Optional: Track when the game was created
    updatedAt: { type: Date, default: Date.now },  // Optional: Track when the game was last updated
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
