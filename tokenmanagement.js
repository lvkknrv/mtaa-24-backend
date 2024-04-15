import jwt from 'jsonwebtoken';
import client from "./db.js";

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET);
};

const verifyToken = async (userId) => {
    try {
        const tokenQuery = 'SELECT token FROM tokens WHERE user_id = $1';
        const tokenResult = await client.query(tokenQuery, [userId]);

        if (tokenResult.rows.length === 0) {
            return null;
        }

        const token = tokenResult.rows[0].token;

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decoded) {
            return null;
        }

        return decoded.userId;
    } catch (error) {
        return null;
    }
};

export {generateToken, verifyToken};