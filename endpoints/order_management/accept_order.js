import express from 'express';
import client from '../../db.js';

const acceptOrderRouter = express.Router();

acceptOrderRouter.put('/accept/:driverId/:orderId', async (req, res) => {
    const driverId = req.params.driverId;
    const orderId = req.params.orderId;

    try {
        const orderCheck = await client.query('SELECT * FROM orders WHERE id = $1', [orderId]);
        if (orderCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await client.query('UPDATE orders SET status_id = 1, driver_id = $1 WHERE id = $2', [driverId, orderId]);

        res.status(200).json({ message: 'Order accepted successfully' });
    } catch (error) {
        console.error('Error when accepting order:', error);
        res.status(500).json({ message: 'An error occurred when accepting the order' });
    }
});

export default acceptOrderRouter;
