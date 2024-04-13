import express from 'express';
import client from '../../db.js';

const deleteRouter = express.Router();

deleteRouter.delete('/:userId/delete', async (req, res) => {
    const userId = req.params.userId;
    try {
        await client.query('DELETE FROM users WHERE id = $1', [userId]);
        res.status(200).json({ message: 'User was successfully deleted' });
    } catch (error) {
        console.error('Error when deleting user:', error);
        res.status(500).json({ message: 'An error occurred when deleting a user' });
    }
});

export default deleteRouter;
