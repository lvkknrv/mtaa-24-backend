import express from 'express';
import validator from 'email-validator';
import client from '../../db.js';
import {verifyToken} from "../../tokenmanagement.js";

const updateEmailRouter = express.Router();

<<<<<<< HEAD
function isValidEmail(email) {
    return validator.validate(email);
}

=======
>>>>>>> f7855045ba9b9096f077894d7f183f39f6b09f82
updateEmailRouter.put('/:userId/email', async (req, res) => {
    try {
        const userId = req.params.userId;
        const newEmail = req.body.newEmail;

        const decodedUserId = await verifyToken(userId);
        if (!decodedUserId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userCheck = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!validator.validate(newEmail)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const emailCheck = await client.query('SELECT * FROM users WHERE email = $1 AND id != $2', [newEmail, userId]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        await client.query('UPDATE users SET email = $1 WHERE id = $2', [newEmail, userId]);

        res.status(200).json({ message: 'Email updated successfully' });
    } catch (error) {
        console.error('Error when updating email:', error);
        res.status(500).json({ message: 'An error occurred when updating the email' });
    }
});

export default updateEmailRouter;
