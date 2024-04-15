import express from 'express';
import validator from 'email-validator';
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
        if (!validator.validate(email)) {
            return res.status(400).json({error: 'Invalid email format.'});
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

registerRouter.post('/drivers', async (req, res) => {
    try {
        const {user_id, model, licenceplate, color_id} = req.body;

        if (!user_id) {
            return res.status(400).json({error: 'Please provide a id.'});
        }
        if (!model) {
            return res.status(400).json({error: 'Please provide an model.'});
        }
        if (!licenceplate) {
            return res.status(400).json({error: 'Please provide a license plate.'});
        }
        if (!color_id) {
            return res.status(400).json({error: 'Please provide a color.'});
        }

        const userRoleQuery = 'SELECT role_id FROM users WHERE id = $1';
        const userRoleResult = await client.query(userRoleQuery, [user_id]);

        if (userRoleResult.rows.length === 0) {
            return res.status(404).json({error: 'User not found.'});
        }

        const userRole = userRoleResult.rows[0].role_id;

        if (userRole !== 2) {
            return res.status(403).json({error: 'User is not authorized to register as a driver.'});
        }

        const insertDriverQuery = 'INSERT INTO drivers (user_id, model, licenceplate, color_id) VALUES ($1, $2, $3, $4) RETURNING *';
        const result = await client.query(insertDriverQuery, [user_id, model, licenceplate, color_id]);
        const newDriver = result.rows[0];

        res.status(201).json({message: 'Driver registered successfully', driver: newDriver});
    } catch (error) {
        console.error('Error registering driver:', error);
        res.status(500).json('Internal Server Error');
    }
});

export default registerRouter;
