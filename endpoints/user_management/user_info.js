import express from 'express';
import client from '../../db.js';
import {verifyToken} from "../../tokenmanagement.js";

const getUserInfoRouter = express.Router();

getUserInfoRouter.get('/:userId/info', async (req, res) => {
    try {
        const userId = req.params.userId;

        const decodedUserId = await verifyToken(userId);
        if (!decodedUserId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const result = await client.query('SELECT username, email, phonenumber, created_at FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = result.rows[0];

        res.json(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'An error occurred when fetching user data' });
    }
});

export default getUserInfoRouter;
