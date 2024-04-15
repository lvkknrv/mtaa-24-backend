import express from 'express';
import client from '../../db.js';
import {verifyToken} from "../../tokenmanagement.js";

const availableOrdersRouter = express.Router();

availableOrdersRouter.get('/', async (req, res) => {
    try {


        const availableOrdersResult = await client.query(
            'SELECT * FROM orders WHERE status_id = 4'
        );

        const availableOrders = availableOrdersResult.rows;
        res.status(200).json({ orders: availableOrders });
    } catch (error) {
        console.error('Error when fetching available orders:', error);
        res.status(500).json({ message: 'An error occurred when fetching available orders' });
    }
});

export default availableOrdersRouter;
