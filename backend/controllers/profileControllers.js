import User from "../models/userModel.js";

export const getProfile = async (req, res) => {
    const { userid } = req.params;
    try {
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ user });
    }catch (error) {
        res.status(500).json({ error: 'Error fetching user profile' });
    }
}
