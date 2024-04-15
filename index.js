import express from 'express';
import client from './db.js';
import registerRouter from './endpoints/user_management/register.js';
import loginRouter from "./endpoints/user_management/login.js";
import deleteRouter from "./endpoints/user_management/delete_account.js";
import updatePasswordRouter from "./endpoints/user_management/password_change.js";
import logoutRouter from "./endpoints/user_management/logout.js";
import createOrderRouter from "./endpoints/order_management/create.js";
import cancelOrderRouter from "./endpoints/order_management/cancel.js";
import availableOrdersRouter from "./endpoints/order_management/available_orders.js";
import updateUsernameRouter from "./endpoints/user_management/username_change.js";
import acceptOrderRouter from "./endpoints/order_management/accept_order.js";

const PORT = 8000;
const app = express();

app.use(express.json());
app.use('/register', registerRouter)
app.use('/login', loginRouter)
app.use('/users', deleteRouter);
app.use('/users', updatePasswordRouter);
app.use('/users', logoutRouter);
app.use('/users', updateUsernameRouter)
app.use('/orders', createOrderRouter);
app.use('/orders', cancelOrderRouter);
app.use('/online', availableOrdersRouter);
app.use('/online', acceptOrderRouter());

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
