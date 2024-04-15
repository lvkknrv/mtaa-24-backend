import express from 'express';
import client from '../../db.js';

const endTripRouter = express.Router();

endTripRouter.put('/:orderId/end', async (req, res) => {
    const orderId = req.params.orderId;

    try {
        const orderCheck = await client.query('SELECT * FROM orders WHERE id = $1', [orderId]);
        if (orderCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const currentDate = new Date().toISOString();
        await client.query('UPDATE orders SET status_id = 2, finished_at = $2 WHERE id = $1', [orderId, currentDate]);

        res.status(200).json({ message: 'Trip ended successfully' });
    } catch (error) {
        console.error('Error when ending trip:', error);
        res.status(500).json({ message: 'An error occurred when ending the trip' });
    }
});

export default endTripRouter;
