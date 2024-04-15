import express from 'express';
import client from '../../db.js';
import {verifyToken} from "../../tokenmanagement.js";

const startTripRouter = express.Router();

startTripRouter.put('/:orderId/start', async (req, res) => {
    try {
        const orderId = req.params.orderId;

        const orderResult = await client.query('SELECT driver_id FROM orders WHERE id = $1', [orderId]);
        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const driverId = orderResult.rows[0].driver_id;

        const Result = await client.query('SELECT user_id FROM drivers WHERE id = $1', [driverId]);
        if (Result.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const userId = Result.rows[0].user_id;


        const decodedUserId = await verifyToken(userId);
        if (!decodedUserId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const orderCheck = await client.query('SELECT * FROM orders WHERE id = $1', [orderId]);
        if (orderCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await client.query('UPDATE orders SET status_id = 3 WHERE id = $1', [orderId]);

        res.status(200).json({ message: 'Trip started successfully' });
    } catch (error) {
        console.error('Error when starting trip:', error);
        res.status(500).json({ message: 'An error occurred when starting the trip' });
    }
});

export default startTripRouter;
