import { Request, Response, NextFunction } from "express";

export const validateCreateSweet = (req: Request, res: Response, next: NextFunction): void => {
    const {name, category, price, createdBy} = req.body;
    const errors: string[] = [];

    if(!name || typeof name !== "string" || name.trim().length<2) {
        errors.push('Name is required and must be at least 2 characters long');
    }
    
    if (!category || typeof category !== 'string' || category.trim().length < 2) {
        errors.push('Category is required and must be at least 2 characters long');
    }

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        errors.push('Price is required and must be a positive number');
    }

    if (!createdBy || typeof createdBy !== 'string') {
        errors.push('Created by (User ID) is required');
    }

    if (req.body.quantity && (isNaN(parseInt(req.body.quantity)) || parseInt(req.body.quantity) < 0)) {
        errors.push('Quantity must be a non-negative number');
    }

    if(errors.length > 0) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
        return;
    }
    next();
}

export const validateUpdateSweet = (req: Request, res: Response, next: NextFunction): void => {
    const { name, category, price, quantity } = req.body;
    const errors: string[] = [];

    if (name !== undefined && (typeof name !== "string" || name.trim().length < 2)) {
        errors.push('Name must be at least 2 characters long if provided');
    }
    
    if (category !== undefined && (typeof category !== 'string' || category.trim().length < 2)) {
        errors.push('Category must be at least 2 characters long if provided');
    }

    if (price !== undefined && (isNaN(parseFloat(price)) || parseFloat(price) <= 0)) {
        errors.push('Price must be a positive number if provided');
    }

    if (quantity !== undefined && (isNaN(parseInt(quantity)) || parseInt(quantity) < 0)) {
        errors.push('Quantity must be a non-negative number if provided');
    }

    if (errors.length > 0) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
        return;
    }
    next();
}

export const validatePurchase = (req: Request, res: Response, next: NextFunction): void => {
    const { quantity, userId } = req.body;
    const errors: string[] = [];

    if (!quantity || isNaN(parseInt(quantity)) || parseInt(quantity) <= 0) {
        errors.push('Quantity is required and must be a positive number');
    }

    if (!userId || typeof userId !== 'string') {
        errors.push('User ID is required');
    }

    if (errors.length > 0) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
        return;
    }
    next();
}

export const validateBulkPurchase = (req: Request, res: Response, next: NextFunction): void => {
    const { items, userId } = req.body;
    const errors: string[] = [];

    if (!userId || typeof userId !== 'string') {
        errors.push('User ID is required');
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
        errors.push('Items array is required and must not be empty');
    } else {
        items.forEach((item, index) => {
            if (!item.sweetId || typeof item.sweetId !== 'string') {
                errors.push(`Item ${index + 1}: Sweet ID is required`);
            }
            
            if (!item.quantity || isNaN(parseInt(item.quantity)) || parseInt(item.quantity) <= 0) {
                errors.push(`Item ${index + 1}: Quantity is required and must be a positive number`);
            }
        });
    }

    if (errors.length > 0) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
        return;
    }
    next();
}

export const validateRestock = (req: Request, res: Response, next: NextFunction): void => {
    const { quantity, adminId } = req.body;
    const errors: string[] = [];

    if (!quantity || isNaN(parseInt(quantity)) || parseInt(quantity) <= 0) {
        errors.push('Quantity is required and must be a positive number');
    }

    if (!adminId || typeof adminId !== 'string') {
        errors.push('Admin ID is required');
    }

    if (errors.length > 0) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
        return;
    }
    next();
}