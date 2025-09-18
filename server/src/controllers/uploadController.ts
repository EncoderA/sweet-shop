import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads', 'images');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, `image-${uniqueSuffix}${fileExtension}`);
    }
});

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

// Upload controller
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
        const filename = file.filename;
        const filepath = file.path;
        const filesize = file.size;
        const mimetype = file.mimetype;

        // Create the URL for accessing the image
        const imageUrl = `/uploads/images/${filename}`;

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                filename,
                originalName: file.originalname,
                mimetype,
                size: filesize,
                url: imageUrl,
                path: filepath
            }
        });

    } catch (error) {
        console.error('Error uploading image:', error);
        
        // Clean up uploaded file if error occurs
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (cleanupError) {
                console.error('Error cleaning up file:', cleanupError);
            }
        }

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
        const uploadedFiles = files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            url: `/uploads/images/${file.filename}`,
            path: file.path
        }));

        res.status(200).json({
            success: true,
            message: `${files.length} images uploaded successfully`,
            data: uploadedFiles
        });

    } catch (error) {
        console.error('Error uploading images:', error);
        
        // Clean up uploaded files if error occurs
        if (req.files && Array.isArray(req.files)) {
            req.files.forEach((file: Express.Multer.File) => {
                try {
                    fs.unlinkSync(file.path);
                } catch (cleanupError) {
                    console.error('Error cleaning up file:', cleanupError);
                }
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to upload images'
        });
    }
};

// Delete image controller
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

        const filepath = path.join(uploadsDir, filename);
        
        // Check if file exists
        if (!fs.existsSync(filepath)) {
            res.status(404).json({
                success: false,
                message: 'Image not found'
            });
            return;
        }

        // Delete the file
        fs.unlinkSync(filepath);

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete image'
        });
    }
};