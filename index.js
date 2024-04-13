import express from 'express';
import client from './db.js';
import jwt from 'jsonwebtoken';
import registerRouter from './endpoints/user_managment/register.js';

const PORT = 5000;
const app = express();

app.use(express.json());
app.use('/register', registerRouter)

app.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;

        if (!username) {
            return res.status(400).json({error: 'Please provide a username.'});
        }
        if (!password) {
            return res.status(400).json({error: 'Please provide a password.'});
        }

        const result = await client.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            const tokenResult = await client.query('SELECT * FROM tokens WHERE user_id = $1', [user.id]);
            let token;

            if (tokenResult.rows.length > 0) {
                token = generateToken(user.id);
                await client.query('UPDATE tokens SET token = $1 WHERE user_id = $2', [token, user.id]);
            } else {
                token = generateToken(user.id);
                await client.query('INSERT INTO tokens (token, user_id) VALUES ($1, $2)', [token, user.id]);
            }

            return res.status(200).json({token});
        } else {
            return res.status(401).json({error: 'Invalid username or password.'});
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({error: 'Internal Server Error'});
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

function generateToken(userId) {
    return jwt.sign({userId: userId}, 'secret-key');
}

app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT));
