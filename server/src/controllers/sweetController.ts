import { Request, Response } from 'express';
import { db } from '../db';
import { sweets, purchases, restocks, users } from '../db/schema';
import { eq, like, and, gte, lte, sql } from 'drizzle-orm';

export const createSweet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, category, price, quantity, imageUrl, createdBy } = req.body

    const existing = await db.query.sweets.findFirst({
      where: (sweet, { eq }) => eq(sweet.name, name.trim())
    })

    if (existing) {
      res.status(400).json({
        success: false,
        message: "A sweet with this name already exists"
      })
      return
    }

    const newSweet = await db
      .insert(sweets)
      .values({
        name: name.trim(),
        description,
        category,
        price,
        quantity: quantity || 0,
        imageUrl,
        createdBy,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning()

    res.status(201).json({
      success: true,
      data: newSweet[0],
      message: "Sweet created successfully"
    })
  } catch (error: any) {
    console.error("Error creating sweet:", error)

    // Duplicate entry error
    if (error.code === "23505") {
      res.status(400).json({
        success: false,
        message: "A sweet with this name already exists"
      })
      return
    }

    res.status(500).json({
      success: false,
      message: "Failed to create sweet"
    })
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
            whereConditions.push(sql`LOWER(${sweets.name}) LIKE LOWER(${`%${name}%`})`);
        }
        
        if (category) {
            whereConditions.push(sql`LOWER(${sweets.category}) LIKE LOWER(${`%${category}%`})`);
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
        const { quantity: purchaseQuantity, userId } = req.body;
        
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Sweet ID is required"
            });
            return;
        }
        
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required"
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

export const purchaseBulkSweets = async (req: Request, res: Response): Promise<void> => {
    try {
        const { items, userId } = req.body;
        
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required"
            });
            return;
        }
        
        if (!items || !Array.isArray(items) || items.length === 0) {
            res.status(400).json({
                success: false,
                message: "Items array is required and must not be empty"
            });
            return;
        }
        
        // Validate items format
        for (const item of items) {
            if (!item.sweetId || !item.quantity || item.quantity <= 0) {
                res.status(400).json({
                    success: false,
                    message: "Each item must have sweetId and quantity > 0"
                });
                return;
            }
        }
        
        // Check stock availability for all items first
        const sweetChecks = await Promise.all(
            items.map(async (item: any) => {
                const sweetResult = await db.select().from(sweets).where(eq(sweets.id, item.sweetId));
                if (sweetResult.length === 0) {
                    return { error: `Sweet with ID ${item.sweetId} not found` };
                }
                
                const sweet = sweetResult[0];
                if (sweet && sweet.quantity < item.quantity) {
                    return { 
                        error: `Insufficient stock for ${sweet.name}. Available: ${sweet.quantity}, Requested: ${item.quantity}` 
                    };
                }
                
                return { sweet, requestedQuantity: item.quantity };
            })
        );
        
        // Check for any errors
        const error = sweetChecks.find(check => check.error);
        if (error) {
            res.status(400).json({
                success: false,
                message: error.error
            });
            return;
        }
        
        // Process all purchases in a transaction-like manner
        const purchaseResults = [];
        const updatedSweets = [];
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const sweetCheck = sweetChecks[i] as { sweet: any; requestedQuantity: number };
            const { sweet, requestedQuantity } = sweetCheck;
            
            const newQuantity = sweet.quantity - requestedQuantity;
            
            // Update sweet quantity
            const updatedSweet = await db
                .update(sweets)
                .set({
                    quantity: newQuantity,
                    updatedAt: new Date()
                })
                .where(eq(sweets.id, sweet.id))
                .returning();
            
            // Record purchase
            const purchase = await db
                .insert(purchases)
                .values({
                    userId,
                    sweetId: sweet.id,
                    quantity: requestedQuantity,
                    priceAtPurchase: sweet.price
                })
                .returning();
            
            purchaseResults.push(purchase[0]);
            updatedSweets.push(updatedSweet[0]);
        }
        
        const totalAmount = purchaseResults.reduce((sum, purchase) => {
            if (purchase && purchase.priceAtPurchase && purchase.quantity) {
                return sum + (Number(purchase.priceAtPurchase) * Number(purchase.quantity));
            }
            return sum;
        }, 0);
        
        res.status(200).json({
            success: true,
            data: {
                purchases: purchaseResults,
                updatedSweets,
                totalAmount,
                totalItems: purchaseResults.reduce((sum, purchase) => {
                    if (purchase && purchase.quantity) {
                        return sum + purchase.quantity;
                    }
                    return sum;
                }, 0)
            },
            message: `Successfully purchased ${purchaseResults.length} different item(s) for ₹${totalAmount}`
        });
    } catch (error) {
        console.error('Error purchasing bulk sweets:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process bulk purchase'
        });
    }
}

export const restockSweet = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { quantity: restockQuantity, adminId } = req.body;
        
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Sweet ID is required"
            });
            return;
        }
        
        if (!adminId) {
            res.status(400).json({
                success: false,
                message: "Admin ID is required"
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

export const getUserPurchases = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required"
            });
            return;
        }
        
        const userPurchases = await db
            .select({
                purchaseId: purchases.id,
                quantity: purchases.quantity,
                priceAtPurchase: purchases.priceAtPurchase,
                purchasedAt: purchases.purchasedAt,
                sweetId: sweets.id,
                sweetName: sweets.name,
                sweetCategory: sweets.category,
                sweetPrice: sweets.price,
                sweetImageUrl: sweets.imageUrl,
                sweetDescription: sweets.description
            })
            .from(purchases)
            .innerJoin(sweets, eq(purchases.sweetId, sweets.id))
            .where(eq(purchases.userId, userId))
            .orderBy(purchases.purchasedAt);
        
        const totalSpent = userPurchases.reduce((sum, purchase) => {
            return sum + (Number(purchase.priceAtPurchase) * Number(purchase.quantity));
        }, 0);
        
        const totalItems = userPurchases.reduce((sum, purchase) => {
            return sum + Number(purchase.quantity);
        }, 0);
        
        res.status(200).json({
            success: true,
            data: {
                purchases: userPurchases,
                summary: {
                    totalOrders: userPurchases.length,
                    totalItems,
                    totalSpent
                }
            },
            message: `Found ${userPurchases.length} purchase(s) for user`
        });
    } catch (error) {
        console.error('Error fetching user purchases:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user purchases'
        });
    }
}

export const getAllUserOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const allUserPurchases = await db
            .select({
                purchaseId: purchases.id,
                userId: purchases.userId,
                quantity: purchases.quantity,
                priceAtPurchase: purchases.priceAtPurchase,
                purchasedAt: purchases.purchasedAt,
                sweetId: sweets.id,
                sweetName: sweets.name,
                sweetCategory: sweets.category,
                sweetPrice: sweets.price,
                sweetImageUrl: sweets.imageUrl,
                sweetDescription: sweets.description,
                userName: users.name,
                userEmail: users.email
            })
            .from(purchases)
            .innerJoin(sweets, eq(purchases.sweetId, sweets.id))
            .innerJoin(users, eq(purchases.userId, users.id))
            .orderBy(sql`${purchases.purchasedAt} DESC`);

        const ordersMap = new Map();
        
        allUserPurchases.forEach(purchase => {
            const orderDate = new Date(purchase.purchasedAt ?? new Date()).toDateString();

            const orderKey = `${purchase.userId}-${orderDate}`;
            
            if (!ordersMap.has(orderKey)) {
                ordersMap.set(orderKey, {
                    orderId: orderKey,
                    userId: purchase.userId,
                    userName: purchase.userName,
                    userEmail: purchase.userEmail,
                    orderDate: purchase.purchasedAt,
                    items: [],
                    totalAmount: 0,
                    totalItems: 0
                });
            }
            
            const order = ordersMap.get(orderKey);
            order.items.push({
                purchaseId: purchase.purchaseId,
                sweetId: purchase.sweetId,
                sweetName: purchase.sweetName,
                sweetCategory: purchase.sweetCategory,
                sweetDescription: purchase.sweetDescription,
                sweetImageUrl: purchase.sweetImageUrl,
                quantity: purchase.quantity,
                priceAtPurchase: Number(purchase.priceAtPurchase),
                currentPrice: Number(purchase.sweetPrice),
                itemTotal: Number(purchase.priceAtPurchase) * Number(purchase.quantity)
            });
            
            order.totalAmount += Number(purchase.priceAtPurchase) * Number(purchase.quantity);
            order.totalItems += Number(purchase.quantity);
        });

        const orders = Array.from(ordersMap.values()).sort((a, b) => 
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalItemsSold = orders.reduce((sum, order) => sum + order.totalItems, 0);
        const uniqueCustomers = new Set(orders.map(order => order.userId)).size;

        res.status(200).json({
            success: true,
            data: {
                orders,
                summary: {
                    totalOrders,
                    totalRevenue,
                    totalItemsSold,
                    uniqueCustomers,
                    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
                }
            },
            message: `Found ${totalOrders} orders from ${uniqueCustomers} customers`
        });
    } catch (error) {
        console.error('Error fetching all user orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user orders'
        });
    }
}

export const getUserOrderHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required"
            });
            return;
        }
        
        const userPurchases = await db
            .select({
                purchaseId: purchases.id,
                quantity: purchases.quantity,
                priceAtPurchase: purchases.priceAtPurchase,
                purchasedAt: purchases.purchasedAt,
                sweetId: sweets.id,
                sweetName: sweets.name,
                sweetCategory: sweets.category,
                sweetPrice: sweets.price,
                sweetImageUrl: sweets.imageUrl,
                sweetDescription: sweets.description
            })
            .from(purchases)
            .innerJoin(sweets, eq(purchases.sweetId, sweets.id))
            .where(eq(purchases.userId, userId))
            .orderBy(sql`${purchases.purchasedAt} DESC`);

        const ordersMap = new Map();
        
        userPurchases.forEach(purchase => {
            const orderDate = new Date(purchase.purchasedAt ?? new Date()).toDateString();

            
            if (!ordersMap.has(orderDate)) {
                ordersMap.set(orderDate, {
                    orderDate: purchase.purchasedAt,
                    items: [],
                    totalAmount: 0,
                    totalItems: 0
                });
            }
            
            const order = ordersMap.get(orderDate);
            order.items.push({
                purchaseId: purchase.purchaseId,
                sweetId: purchase.sweetId,
                sweetName: purchase.sweetName,
                sweetCategory: purchase.sweetCategory,
                sweetDescription: purchase.sweetDescription,
                sweetImageUrl: purchase.sweetImageUrl,
                quantity: purchase.quantity,
                priceAtPurchase: Number(purchase.priceAtPurchase),
                currentPrice: Number(purchase.sweetPrice),
                itemTotal: Number(purchase.priceAtPurchase) * Number(purchase.quantity)
            });
            
            order.totalAmount += Number(purchase.priceAtPurchase) * Number(purchase.quantity);
            order.totalItems += Number(purchase.quantity);
        });

        const orders = Array.from(ordersMap.values()).sort((a, b) => 
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );

        const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalItems = orders.reduce((sum, order) => sum + order.totalItems, 0);

        res.status(200).json({
            success: true,
            data: {
                orders,
                summary: {
                    totalOrders: orders.length,
                    totalItems,
                    totalSpent,
                    averageOrderValue: orders.length > 0 ? totalSpent / orders.length : 0
                }
            },
            message: `Found ${orders.length} orders for user`
        });
    } catch (error) {
        console.error('Error fetching user order history:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user order history'
        });
    }
}
