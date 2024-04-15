import express from 'express';
import multer from 'multer';
import client from '../../db.js';

const uploadImageRouter = express.Router();

const upload = multer();

uploadImageRouter.post('/:userId/photo/upload', upload.single('imageFile'), async (req, res) => {
    const userId = req.params.userId;
    try {
        const imageData = req.file.buffer;

        const result = await client.query('UPDATE users SET image = $1 WHERE id = $2\n', [imageData, userId]);

        res.status(201).json({ message: 'Image uploaded successfully'});
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'An error occurred when uploading the image' });
    }
});

export default uploadImageRouter;
