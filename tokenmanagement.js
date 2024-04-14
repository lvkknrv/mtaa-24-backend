import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET);
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return decoded.userId;
    } catch (error) {
        return null;
    }
};

export {generateToken, verifyToken};