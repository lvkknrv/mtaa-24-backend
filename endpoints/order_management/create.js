import express from 'express';
import client from '../../db.js';
import {verifyToken} from "../../tokenmanagement.js";

const createOrderRouter = express.Router();

createOrderRouter.post('/:userId/create', async (req, res) => {
    try {
        const userId = req.params.userId;
        const {pickupLocation, destinationLocation} = req.body;

        const decodedUserId = await verifyToken(userId);
        if (!decodedUserId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const currentDate = new Date().toISOString();
        const result = await client.query(
            'INSERT INTO orders (user_id, pickupLocation, destinationLocation, created_at, status_id) VALUES ($1, $2, $3, $4, 4)',
            [userId, pickupLocation, destinationLocation, currentDate]
        );

        const newOrder = result.rows[0];
        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error when creating order:', error);
        res.status(500).json({ message: 'An error occurred when creating the order' });
    }
});

export default createOrderRouter;
