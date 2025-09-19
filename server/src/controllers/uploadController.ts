import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { ensureDirectoryExists, resolveUploadsImagesDir } from '../utils/fileUtils';

// Configure multer for memory storage when using Cloudinary
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
        fileSize: 4 * 1024 * 1024, // 4MB to fit Vercel serverless body limits
    }
});

// Single image upload middleware
export const uploadSingle = upload.single('image');

function configureCloudinaryOrThrow(): void {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error('Cloudinary configuration missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true
    });
}

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

        // Configure Cloudinary from env (validated)
        configureCloudinaryOrThrow();

        const file = req.file as Express.Multer.File;
        const buffer = file.buffer;

        // Upload to Cloudinary using upload_stream
        const uploadResult: any = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: process.env.CLOUDINARY_FOLDER || 'sweet-shop/images',
                    resource_type: 'image',
                    overwrite: false,
                    unique_filename: true
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        return reject(error);
                    }
                    resolve(result);
                }
            );
            stream.end(buffer);
        });

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                filename: uploadResult.public_id,
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                url: uploadResult.secure_url
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

        // Configure Cloudinary from env (validated)
        configureCloudinaryOrThrow();

        const files = req.files as Express.Multer.File[];
        const uploadedFiles = await Promise.all(files.map(file => new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: process.env.CLOUDINARY_FOLDER || 'sweet-shop/images',
                    resource_type: 'image',
                    overwrite: false,
                    unique_filename: true
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve({
                        filename: (result as any).public_id,
                        originalName: file.originalname,
                        mimetype: file.mimetype,
                        size: file.size,
                        url: (result as any).secure_url
                    });
                }
            );
            stream.end(file.buffer);
        })));

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