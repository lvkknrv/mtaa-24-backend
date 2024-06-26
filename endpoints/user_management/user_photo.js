import express from 'express';
import client from '../../db.js';
import sharp from 'sharp';
import {verifyToken} from "../../tokenmanagement.js";

const getUserPhotoRouter = express.Router();

getUserPhotoRouter.get('/:userId/photo', async (req, res) => {
    try {
        const userId = req.params.userId;

        const decodedUserId = await verifyToken(userId);
        if (!decodedUserId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const result = await client.query('SELECT image FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = result.rows[0];

        const imageBytes = userData.image;

        if (!imageBytes) {
            return res.status(404).json({ message: 'User photo not found' });
        }

        const jpegImage = await sharp(Buffer.from(imageBytes)).toFormat('jpeg').toBuffer();

        res.writeHead(200, {
            'Content-Type': 'image/jpeg',
            'Content-Length': jpegImage.length
        });

        res.end(jpegImage);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'An error occurred when fetching user data' });
    }
});

export default getUserPhotoRouter;
