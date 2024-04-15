import express from 'express';
import client from '../../db.js';
import {verifyToken} from "../../tokenmanagement.js";

const cancelOrderRouter = express.Router();

cancelOrderRouter.delete('/:userId/:orderId/cancel', async (req, res) => {
    try {
        const userId = req.params.userId;
        const orderId = req.params.orderId;

        const decodedUserId = await verifyToken(userId);
        if (!decodedUserId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const orderCheck = await client.query(
            'SELECT * FROM orders WHERE id = $1 AND user_id = $2 AND status_id = 4',
            [orderId, userId]
        );
        if (orderCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found for the user' });
        }

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
