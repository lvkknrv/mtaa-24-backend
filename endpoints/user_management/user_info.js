import express from 'express';
import client from '../../db.js';

const getUserInfoRouter = express.Router();

getUserInfoRouter.get('/:userId/info', async (req, res) => {
    const userId = req.params.userId;
    try {
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
