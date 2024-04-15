import express from 'express';
import client from '../../db.js';
import {verifyToken} from "../../tokenmanagement.js";

const acceptOrderRouter = express.Router();

acceptOrderRouter.put('/accept/:driverId/:orderId', async (req, res) => {
    try {
        const driverId = req.params.driverId;
        const orderId = req.params.orderId;

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

        const currentDate = new Date().toISOString();
        await client.query('UPDATE orders SET status_id = 1, driver_id = $1, accepted_at = $2 WHERE id = $3', [driverId, currentDate, orderId]);

        res.status(200).json({ message: 'Order accepted successfully' });
    } catch (error) {
        console.error('Error when accepting order:', error);
        res.status(500).json({ message: 'An error occurred when accepting the order' });
    }
});

export default acceptOrderRouter;
