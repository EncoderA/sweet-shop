import { Router, Request, Response } from 'express';
import { 
    uploadSingle, 
    uploadMultiple, 
    uploadImage, 
    uploadMultipleImages, 
    deleteImage 
} from '../controllers/uploadController';

const router = Router();

// Single image upload route
router.post('/single', (req: Request, res: Response) => {
    uploadSingle(req, res, (err: any) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.status(400).json({
                    success: false,
                    message: 'File size too large. Maximum size is 5MB.'
                });
                return;
            }
            
            if (err.message === 'Only image files are allowed!') {
                res.status(400).json({
                    success: false,
                    message: 'Only image files are allowed!'
                });
                return;
            }
            
            res.status(400).json({
                success: false,
                message: err.message || 'Upload failed'
            });
            return;
        }
        
        // Continue with the upload controller
        uploadImage(req, res);
    });
});

// Multiple images upload route
router.post('/multiple', (req: Request, res: Response) => {
    uploadMultiple(req, res, (err: any) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.status(400).json({
                    success: false,
                    message: 'File size too large. Maximum size is 5MB per file.'
                });
                return;
            }
            
            if (err.message === 'Only image files are allowed!') {
                res.status(400).json({
                    success: false,
                    message: 'Only image files are allowed!'
                });
                return;
            }
            
            res.status(400).json({
                success: false,
                message: err.message || 'Upload failed'
            });
            return;
        }
        
        // Continue with the upload controller
        uploadMultipleImages(req, res);
    });
});

// Delete image route
router.delete('/:filename', deleteImage);

// Health check route for upload service
router.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Upload service is running',
        timestamp: new Date().toISOString()
    });
});

export default router;