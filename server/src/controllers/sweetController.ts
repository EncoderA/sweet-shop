import { Request, Response } from 'express';
import { db } from '../db';
import { sweets, purchases, restocks } from '../db/schema';
import { eq, like, and, gte, lte } from 'drizzle-orm';

export const createSweet = async (req: Request, res: Response): Promise<void> => {
    try {
        const {name, description, category, price, quantity, imageUrl} = req.body;

        const createdBy = (req as any).user?.id;

        const newSweet = await db
            .insert(sweets)
            .values({
                name, 
                description, 
                category,
                price,
                quantity: quantity || 0,
                imageUrl,
                createdBy,
                createdAt: new Date(),
                updatedAt: new Date()
            })
            .returning();

        res.status(201).json({
            sucess: true,
            data: newSweet[0],
            message: "Sweet created successfully"
        });
    } catch (error) {
        console.error('Error creating sweet: ', error);

        if((error as any).code === '23505') {
            res.status(400).json({
                success: false,
                message: "A sweet with this name already exists"
            });
            return;
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to create sweet'
        });
    }
}

export const getAllSweets = async (req: Request, res: Response) => {
    try {
        const allSweets = await db.select().from(sweets);
        
        res.status(200).json({
            success: true,
            data: allSweets,
            message: "Sweets retrieved successfully"
        });
    } catch (error) {
        console.error('Error fetching sweets:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sweets'
        });
    }
}

export const searchSweets = async (req: Request, res: Response) => {
    try {
        const { name, category, minPrice, maxPrice } = req.query;
        
        let whereConditions = [];
        
        if (name) {
            whereConditions.push(like(sweets.name, `%${name}%`));
        }
        
        if (category) {
            whereConditions.push(like(sweets.category, `%${category}%`));
        }
        
        if (minPrice) {
            whereConditions.push(gte(sweets.price, minPrice.toString()));
        }
        
        if (maxPrice) {
            whereConditions.push(lte(sweets.price, maxPrice.toString()));
        }
        
        let searchResults;
        
        if (whereConditions.length > 0) {
            searchResults = await db.select().from(sweets).where(and(...whereConditions));
        } else {
            searchResults = await db.select().from(sweets);
        }
        
        res.status(200).json({
            success: true,
            data: searchResults,
            message: "Search completed successfully",
            count: searchResults.length
        });
    } catch (error) {
        console.error('Error searching sweets:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search sweets'
        });
    }
}

export const updateSweet = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, category, price, quantity, imageUrl } = req.body;
        
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Sweet ID is required"
            });
            return;
        }
        
        const existingSweet = await db.select().from(sweets).where(eq(sweets.id, id));
        
        if (existingSweet.length === 0) {
            res.status(404).json({
                success: false,
                message: "Sweet not found"
            });
            return;
        }
        
        const updatedSweet = await db
            .update(sweets)
            .set({
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(category && { category }),
                ...(price && { price }),
                ...(quantity !== undefined && { quantity }),
                ...(imageUrl !== undefined && { imageUrl }),
                updatedAt: new Date()
            })
            .where(eq(sweets.id, id))
            .returning();
        
        res.status(200).json({
            success: true,
            data: updatedSweet[0],
            message: "Sweet updated successfully"
        });
    } catch (error) {
        console.error('Error updating sweet:', error);
        
        if ((error as any).code === '23505') {
            res.status(400).json({
                success: false,
                message: "A sweet with this name already exists"
            });
            return;
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to update sweet'
        });
    }
}

export const deleteSweet = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Sweet ID is required"
            });
            return;
        }
        
        const existingSweet = await db.select().from(sweets).where(eq(sweets.id, id));
        
        if (existingSweet.length === 0) {
            res.status(404).json({
                success: false,
                message: "Sweet not found"
            });
            return;
        }
        
        await db.delete(sweets).where(eq(sweets.id, id));
        
        res.status(200).json({
            success: true,
            message: "Sweet deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting sweet:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete sweet'
        });
    }
}

export const purchaseSweet = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { quantity: purchaseQuantity } = req.body;
        const userId = (req as any).user?.id;
        
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Sweet ID is required"
            });
            return;
        }
        
        if (!purchaseQuantity || purchaseQuantity <= 0) {
            res.status(400).json({
                success: false,
                message: "Purchase quantity must be a positive number"
            });
            return;
        }
        
        const sweetResult = await db.select().from(sweets).where(eq(sweets.id, id));
        
        if (sweetResult.length === 0) {
            res.status(404).json({
                success: false,
                message: "Sweet not found"
            });
            return;
        }
        
        const currentSweet = sweetResult[0]!;
        
        if (currentSweet.quantity < purchaseQuantity) {
            res.status(400).json({
                success: false,
                message: `Insufficient stock. Available: ${currentSweet.quantity}, Requested: ${purchaseQuantity}`
            });
            return;
        }
        
        const newQuantity = currentSweet.quantity - purchaseQuantity;
        
        const updatedSweet = await db
            .update(sweets)
            .set({
                quantity: newQuantity,
                updatedAt: new Date()
            })
            .where(eq(sweets.id, id))
            .returning();
        
        const purchase = await db
            .insert(purchases)
            .values({
                userId,
                sweetId: id,
                quantity: purchaseQuantity,
                priceAtPurchase: currentSweet.price
            })
            .returning();
        
        res.status(200).json({
            success: true,
            data: {
                sweet: updatedSweet[0],
                purchase: purchase[0]
            },
            message: `Successfully purchased ${purchaseQuantity} ${currentSweet.name}(s)`
        });
    } catch (error) {
        console.error('Error purchasing sweet:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to purchase sweet'
        });
    }
}

export const restockSweet = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { quantity: restockQuantity } = req.body;
        const adminId = (req as any).user?.id;
        
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Sweet ID is required"
            });
            return;
        }
        
        if (!restockQuantity || restockQuantity <= 0) {
            res.status(400).json({
                success: false,
                message: "Restock quantity must be a positive number"
            });
            return;
        }
        
        const sweetResult = await db.select().from(sweets).where(eq(sweets.id, id));
        
        if (sweetResult.length === 0) {
            res.status(404).json({
                success: false,
                message: "Sweet not found"
            });
            return;
        }
        
        const currentSweet = sweetResult[0]!;
        const newQuantity = currentSweet.quantity + restockQuantity;
        
        const updatedSweet = await db
            .update(sweets)
            .set({
                quantity: newQuantity,
                updatedAt: new Date()
            })
            .where(eq(sweets.id, id))
            .returning();
        
        const restock = await db
            .insert(restocks)
            .values({
                adminId,
                sweetId: id,
                quantityAdded: restockQuantity
            })
            .returning();
        
        res.status(200).json({
            success: true,
            data: {
                sweet: updatedSweet[0],
                restock: restock[0]
            },
            message: `Successfully restocked ${restockQuantity} ${currentSweet.name}(s). New quantity: ${newQuantity}`
        });
    } catch (error) {
        console.error('Error restocking sweet:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to restock sweet'
        });
    }
}