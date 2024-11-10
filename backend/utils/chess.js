
export const getGameResult = (chessInstance) => {
    if (chessInstance.isCheckmate()) return 'checkmate';
    if (chessInstance.isStalemate()) return 'stalemate';
    if (chessInstance.isDraw()) return 'draw';
    return null;
};

