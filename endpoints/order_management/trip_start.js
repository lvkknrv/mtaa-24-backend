import express from 'express';
import client from '../../db.js';

const startTripRouter = express.Router();

startTripRouter.put('/:orderId/start', async (req, res) => {
    const orderId = req.params.orderId;

    try {
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
