
export const startTimer = (roomId, timers, io) => {
    timers[roomId].interval = setInterval(() => {
        const currentPlayer = timers[roomId].currentTimer;

        // Decrease the timer for the current player
        timers[roomId][currentPlayer] -= 1;

        // Emit the updated timer to both players
        io.to(roomId).emit('timerUpdate', timers[roomId]);

        // If the timer reaches zero, end the game
        if (timers[roomId][currentPlayer] <= 0) {
            clearInterval(timers[roomId].interval);
            const winner = currentPlayer === 'player1' ? 'player2' : 'player1';

            io.to(roomId).emit('gameOver', {
                result: 'timeout',
                winner,
            });
        }
    }, 1000); // Run every second
};

export const isGameOver = (chess) => {
    if (chess.in_checkmate()) return 'checkmate';
    if (chess.in_draw()) return 'draw';
    if (chess.in_stalemate()) return 'stalemate';
    if (chess.insufficient_material()) return 'insufficient material';
    if (chess.in_threefold_repetition()) return 'threefold repetition';
    return null;
};

export const getGameResult = (chess) => {
    const gameOverType = isGameOver(chess);

    switch (gameOverType) {
        case 'checkmate':
            return 'checkmate';
        case 'draw':
        case 'stalemate':
        case 'insufficient material':
        case 'threefold repetition':
            return 'draw';
        default:
            return null;
    }
};
