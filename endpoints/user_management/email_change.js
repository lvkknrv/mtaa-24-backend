import express from 'express';
import validator from 'email-validator'; // Импортируем библиотеку для валидации имейла
import client from '../../db.js';

const updateEmailRouter = express.Router();

// Функция для проверки валидности имейла
function isValidEmail(email) {
    return validator.validate(email); // Используем метод validate из библиотеки email-validator
}

updateEmailRouter.put('/:userId/email', async (req, res) => {
    const userId = req.params.userId;
    const newEmail = req.body.newEmail;

    try {
        const userCheck = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!validator.validate(email)) {
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
