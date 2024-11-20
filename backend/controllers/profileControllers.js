import User from "../models/userModel.js";
import Game from "../models/gameModel.js";

export const getProfile = async (req, res) => {
    const { userid } = req.params;
    try {
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    }catch (error) {
        res.status(500).json({ error: 'Error fetching user profile' });
    }
}

export const getGames = async (req, res) =>{
    const { userid } = req.body;
    try{
        if (!userid) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const games = await Game.find({$or: [{player1: userid}, {player2: userid}]});

        if(games.length === 0){
            return res.status(404).json({ error: 'No Games found' });
        }
        res.status(200).json(games); // array of games

    }catch(error){
        res.status(500).json({ error: 'Error fetching games' });
    }
}