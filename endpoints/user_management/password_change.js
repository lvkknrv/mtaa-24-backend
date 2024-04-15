import express from 'express';
import client from '../../db.js';
import {verifyToken} from "../../tokenmanagement.js";

const updatePasswordRouter = express.Router();

updatePasswordRouter.put('/:userId/password', async (req, res) => {
    try {
        const userId = req.params.userId;
        const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;

        const decodedUserId = await verifyToken(userId);
        if (!decodedUserId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        await client.query('UPDATE users SET password = $1 WHERE id = $2', [newPassword, userId]);

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error when updating password:', error);
        res.status(500).json({ message: 'An error occurred when updating the password' });
    }
});

export default updatePasswordRouter;
