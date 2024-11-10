import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization || req.cookies.accessToken;
    console.log("token to verify : ", token);
    if (token === 'null' || !token) {
        return res.status(401).json({ error: 'Access Denied' });
    }
    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}
export { verifyToken };