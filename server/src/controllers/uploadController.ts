import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

// Configure multer for memory storage (serverless compatible)
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// Single image upload middleware
export const uploadSingle = upload.single('image');

// Upload controller - stores image data in memory for now
// TODO: Replace with cloud storage like Vercel Blob, AWS S3, or Cloudinary
export const uploadImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
            return;
        }

        // Get the file information
        const file = req.file;
        const timestamp = Date.now();
        const randomSuffix = Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        const filename = `image-${timestamp}-${randomSuffix}${fileExtension}`;

        // In a real deployment, you would upload to cloud storage here
        // For now, we'll return the base64 data URL (not recommended for production)
        const base64Data = file.buffer.toString('base64');
        const dataUrl = `data:${file.mimetype};base64,${base64Data}`;

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                filename,
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                url: dataUrl, // In production, this would be the cloud storage URL
                note: 'This is a temporary solution. Implement cloud storage for production.'
            }
        });

    } catch (error) {
        console.error('Error uploading image:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to upload image'
        });
    }
};

// Multiple images upload middleware
export const uploadMultiple = upload.array('images', 5);

// Multiple images upload controller
export const uploadMultipleImages = async (req: Request, res: Response) => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            res.status(400).json({
                success: false,
                message: 'No image files provided'
            });
            return;
        }

        const files = req.files as Express.Multer.File[];
        const uploadedFiles = files.map(file => {
            const timestamp = Date.now();
            const randomSuffix = Math.round(Math.random() * 1E9);
            const fileExtension = path.extname(file.originalname);
            const filename = `image-${timestamp}-${randomSuffix}${fileExtension}`;
            
            // Convert to base64 data URL (temporary solution)
            const base64Data = file.buffer.toString('base64');
            const dataUrl = `data:${file.mimetype};base64,${base64Data}`;

            return {
                filename,
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                url: dataUrl,
                note: 'This is a temporary solution. Implement cloud storage for production.'
            };
        });

        res.status(200).json({
            success: true,
            message: `${files.length} images uploaded successfully`,
            data: uploadedFiles
        });

    } catch (error) {
        console.error('Error uploading images:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to upload images'
        });
    }
};

// Delete image controller - placeholder for cloud storage implementation
export const deleteImage = async (req: Request, res: Response) => {
    try {
        const { filename } = req.params;
        
        if (!filename) {
            res.status(400).json({
                success: false,
                message: 'Filename is required'
            });
            return;
        }

        // TODO: Implement cloud storage deletion
        res.status(200).json({
            success: true,
            message: 'Image deletion not implemented with cloud storage yet'
        });

    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete image'
        });
    }
};