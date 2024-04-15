import express from 'express';
import client from '../../db.js';
import {verifyToken} from '../../tokenmanagement.js';

const logoutRouter = express.Router();

logoutRouter.delete('/:userId/logout', async (req, res) => {
    try {
        const userId = req.params.userId;

        const decodedUserId = await verifyToken(userId);
        if (!decodedUserId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const deleteTokenQuery = 'DELETE FROM tokens WHERE user_id = $1';
        await client.query(deleteTokenQuery, [userId]);

        return res.status(200).json({message: 'Logout successful.'});
    } catch (error) {
        console.error('Error logging out user:', error);
        return res.status(500).json({error: 'Internal Server Error'});
    }
});

export default logoutRouter;