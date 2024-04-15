import express from 'express';
import client from '../../db.js';
import {verifyToken} from "../../tokenmanagement.js";

const updateUsernameRouter = express.Router();

updateUsernameRouter.put('/:userId/username', async (req, res) => {
    try {
        const userId = req.params.userId;
        const newUsername = req.body.newUsername;

        const decodedUserId = await verifyToken(userId);
        if (!decodedUserId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userCheck = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        await client.query('UPDATE users SET username = $1 WHERE id = $2', [newUsername, userId]);

        return res.status(200).json({ message: 'Username updated successfully' });
    } catch (error) {
        console.error('Error when updating username:', error);
        return res.status(500).json({ message: 'An error occurred when updating the username' });
    }
});


export default updateUsernameRouter;
