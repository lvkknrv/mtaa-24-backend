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


app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT));
