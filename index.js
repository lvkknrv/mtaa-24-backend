import express from 'express';
import client from './db.js';
import registerRouter from './endpoints/user_managment/register.js';
import loginRouter from "./endpoints/user_managment/login.js";
import deleteRouter from "./endpoints/user_managment/delete_account.js";
import updatePasswordRouter from "./endpoints/user_managment/password_change.js";
import logoutRouter from "./endpoints/user_managment/logout.js";


const PORT = 8000;
const app = express();

app.use(express.json());
app.use('/register', registerRouter)
app.use('/login', loginRouter)
app.use('/users', deleteRouter);
app.use('/users', updatePasswordRouter);
app.use('/users', logoutRouter);

app.get('/users', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM users');
        const rows = result.rows;
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json('Internal Server Error');
    }
});

app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT));
