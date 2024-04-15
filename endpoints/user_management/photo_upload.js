import express from 'express';
import client from '../../db.js';

const uploadImageRouter = express.Router();

uploadImageRouter.post('/:userId/photo', async (req, res) => {
    try {
        const imageData = req.files.imageFile.data;

        const result = await client.query('INSERT INTO users (image) VALUES ($1)', [imageData]);
        const newImageId = result.rows[0].id;

        res.status(201).json({ message: 'Image uploaded successfully', imageId: newImageId });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'An error occurred when uploading the image' });
    }
});

export default uploadImageRouter;
