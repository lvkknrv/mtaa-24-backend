import express from 'express';
import multer from 'multer';
import client from '../../db.js';
import {verifyToken} from "../../tokenmanagement.js";

const uploadImageRouter = express.Router();

const upload = multer();

uploadImageRouter.put('/:userId/photo/upload', upload.single('imageFile'), async (req, res) => {
    try {
        const userId = req.params.userId;
        const imageData = req.file.buffer;

        const decodedUserId = await verifyToken(userId);
        if (!decodedUserId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        await client.query('UPDATE users SET image = $1 WHERE id = $2\n', [imageData, userId]);

        res.status(201).json({ message: 'Image uploaded successfully'});
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'An error occurred when uploading the image' });
    }
});

export default uploadImageRouter;
