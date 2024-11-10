// chess.js
import { Chess } from 'chess.js';

export function initializeGame() {
    return new Chess();  // Creates a new Chess game with the initial FEN
}

export function makeMove(chessInstance, move) {
    const moveResult = chessInstance.move(move);
    return moveResult ? true : false;  // Return true if the move was valid, else false
}

export function getBoardState(chessInstance) {
    return chessInstance.fen();
}

export function isGameOver(chessInstance) {
    return chessInstance.game_over() || chessInstance.in_checkmate() || chessInstance.in_stalemate() || chessInstance.in_threefold_repetition() || chessInstance.insufficient_material();
}

export function getGameResult(chessInstance) {
    if (chessInstance.in_checkmate()) {
        return 'checkmate';
    } else if (chessInstance.in_stalemate()) {
        return 'stalemate';
    } else if (chessInstance.in_draw()) {
        return 'draw';
    } else {
        return 'ongoing';
    }
}

export function isCheckmateOrCheck(chessInstance) {
    return chessInstance.in_checkmate() || chessInstance.in_check();
}

export async function updateGameState(game, chessInstance, player1Id, player2Id) {
    game.boardState = chessInstance.fen();
    game.currentPlayer = game.currentPlayer.equals(player1Id) ? player2Id : player1Id;
    await game.save();
}
