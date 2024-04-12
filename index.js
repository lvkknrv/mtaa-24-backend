import express from 'express';
import client from './db.js';

const PORT = 5000;
const app = express();

app.use(express.json());

app.get('/colors', async (req, res) => {
    try {
        //const client = await pool.connect();
        const result = await client.query('SELECT * FROM colors');
        const rows = result.rows;
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json('Internal Server Error');
    }
});

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate user input
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Please provide username, email, and password' });
        }

        // Insert new user into the database
        const result = await client.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, password]);
        const newUser = result.rows[0];

        // Return success response
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json('Internal Server Error');
    }
});

app.get('/users', async (req, res) => {
    try {
        //const client = await pool.connect();
        const result = await client.query('SELECT * FROM users');
        const rows = result.rows;
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json('Internal Server Error');
    }
});

app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT));
