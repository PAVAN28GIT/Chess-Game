import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwtToken;
    if (token === 'null' || !token || token === undefined) {
        return res.status(401).json({ message: 'Access Denied' });
    }
    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified; //set payload of the token to req.user
        next();
    } catch (error) {
        console.log("Error in verifying token ");
        res.status(400).send('Invalid Token');
    }
}
export { verifyToken };