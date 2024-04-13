import express from 'express';
import client from '../../db.js';

const registerRouter = express.Router();

registerRouter.post('/', async (req, res) => {
    try {
        const {username, phonenumber, email, password, role_id} = req.body;
        const currentDate = new Date().toISOString();

        if (!username) {
            return res.status(400).json({error: 'Please provide a username.'});
        }
        if (!phonenumber) {
            return res.status(400).json({error: 'Please provide a phone number.'});
        }
        if (!email) {
            return res.status(400).json({error: 'Please provide an email.'});
        }
        if (!password) {
            return res.status(400).json({error: 'Please provide a password.'});
        }
        if (!role_id) {
            return res.status(400).json({error: 'Please provide a role ID.'});
        }

        const result = await client.query('INSERT INTO users (username, phonenumber, email, password, created_at, role_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [username, phonenumber, email, password, currentDate, role_id]);
        const newUser = result.rows[0];

        res.status(201).json({message: 'User registered successfully', user: newUser});
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json('Internal Server Error');
    }
});

export default registerRouter;
