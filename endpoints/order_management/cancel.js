import express from 'express';
import client from '../../db.js';

const cancelOrderRouter = express.Router();

cancelOrderRouter.delete('/:userId/:orderId/cancel', async (req, res) => {
    const userId = req.params.userId;
    const orderId = req.params.orderId;

    try {
        await client.query(
            'DELETE FROM orders o WHERE o.id = $1 AND o.user_id = $2 AND o.status_id = 4',
            [orderId, userId]
        );

        res.status(201).json({ message: 'Order canceled successfully'});
    } catch (error) {
        console.error('Error when canceling order:', error);
        res.status(500).json({ message: 'An error occurred when canceling the order' });
    }
});

export default cancelOrderRouter;
