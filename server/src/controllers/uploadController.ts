import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ensureDirectoryExists, resolveUploadsImagesDir } from '../utils/fileUtils';

// Configure multer for disk storage to persist files under uploads/images
const imagesDir = resolveUploadsImagesDir(__dirname);
ensureDirectoryExists(imagesDir);

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, imagesDir);
    },
    filename: (_req, file, cb) => {
        const timestamp = Date.now();
        const randomSuffix = Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, '_');
        cb(null, `${base}-${timestamp}-${randomSuffix}${ext}`);
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

        const file = req.file as Express.Multer.File & { filename: string; path: string };

        // Build public URL path served by Express static middleware
        const publicPath = `/uploads/images/${file.filename}`;

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                filename: file.filename,
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                url: publicPath
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
        const uploadedFiles = files.map((file) => ({
            filename: (file as any).filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            url: `/uploads/images/${(file as any).filename}`
        }));

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