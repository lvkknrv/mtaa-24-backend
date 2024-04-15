import express from 'express';
import client from '../../db.js';
import { verifyToken } from "../../tokenmanagement.js";

const endTripRouter = express.Router();

endTripRouter.put('/:orderId/end', async (req, res) => {
    try {
        const orderId = req.params.orderId;

        const orderResult = await client.query('SELECT driver_id, status_id FROM orders WHERE id = $1', [orderId]);
        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const { driver_id: driverId, status_id: statusId } = orderResult.rows[0];

        const driverResult = await client.query('SELECT user_id FROM drivers WHERE id = $1', [driverId]);
        if (driverResult.rows.length === 0) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        const userId = driverResult.rows[0].user_id;

        const decodedUserId = await verifyToken(userId);
        if (!decodedUserId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (statusId !== 3) {
            return res.status(400).json({ message: 'Cannot end trip. Trip has not started yet' });
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
