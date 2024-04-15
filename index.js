import express from 'express';
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
import startTripRouter from "./endpoints/order_management/trip_start.js";
import endTripRouter from "./endpoints/order_management/trip_end.js";
import uploadImageRouter from "./endpoints/user_management/photo_upload.js";
import updateEmailRouter from "./endpoints/user_management/email_change.js";
import getUserPhotoRouter from "./endpoints/user_management/user_photo.js";
import getUserInfoRouter from "./endpoints/user_management/user_info.js";

const PORT = 8000;
const app = express();

app.use(express.json());

app.use('/register', registerRouter)
app.use('/login', loginRouter)
app.use('/users', deleteRouter);
app.use('/users', updatePasswordRouter);
app.use('/users', logoutRouter);
app.use('/users', updateUsernameRouter);
app.use('/users', updateEmailRouter);
app.use('/users', uploadImageRouter);
app.use('/users', getUserPhotoRouter);
app.use('/users', getUserInfoRouter);
app.use('/orders', createOrderRouter);
app.use('/orders', cancelOrderRouter);
app.use('/online', availableOrdersRouter);
app.use('/online', acceptOrderRouter);
app.use('/online', startTripRouter);
app.use('/online', endTripRouter);

app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT));
