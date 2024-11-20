import Game from '../models/gameModel.js';

export const reconnect = async (req, res) => {

    const { gameId , playerId } = req.body;

    try {
        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }
        if (game.player1.toString() === playerId || game.player2.toString() === playerId) {
            return res.status(200).json(game);
        }
        res.status(403).json({ error: 'Unauthorized' });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching game' });
    }
 
}