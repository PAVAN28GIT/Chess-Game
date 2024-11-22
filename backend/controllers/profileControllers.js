import User from "../models/userModel.js";
import Game from "../models/gameModel.js";

export const getProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const [user, games] = await Promise.all([
            User.findById(id),  // Fetch user info by ID
            Game.find({ $or: [{ player1: id }, { player2: id }] })  // Fetch games where the user is player1 or player2
        ]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            user,   
            games: games || []   // If no games are found, send an empty array
        });
               
    }catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error fetching user profile' });
    }
}


export const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error fetching user' });
    }
}
