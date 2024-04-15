import express from 'express';
import client from '../../db.js';
import {verifyToken} from "../../tokenmanagement.js";

const deleteRouter = express.Router();

deleteRouter.delete('/:userId/delete', async (req, res) => {
    try {
        const userId = req.params.userId

        const decodedUserId = await verifyToken(userId);
        if (!decodedUserId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        await client.query('DELETE FROM users WHERE id = $1', [userId]);
        res.status(200).json({ message: 'User was successfully deleted' });
    } catch (error) {
        console.error('Error when deleting user:', error);
        res.status(500).json({ message: 'An error occurred when deleting a user' });
    }
});

export default deleteRouter;
