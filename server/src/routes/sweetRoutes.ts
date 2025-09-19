import { Router } from "express";
import { 
    createSweet, 
    getAllSweets, 
    searchSweets, 
    updateSweet, 
    deleteSweet, 
    purchaseSweet, 
    purchaseBulkSweets,
    restockSweet, 
    getUserPurchases,
    getAllUserOrders,
    getUserOrderHistory
} from "../controllers/sweetController";
import { 
    validateCreateSweet, 
    validateUpdateSweet, 
    validatePurchase, 
    validateBulkPurchase,
    validateRestock 
} from "../middleware/sweetsValidation";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware";    

const router = Router();

router.post('/', 
    authenticateToken, 
    authorizeRole(['admin']),
    validateCreateSweet,
    createSweet
);

router.get('/', 
    authenticateToken,
    getAllSweets
);

router.get('/user/:userId', 
    authenticateToken,
    getUserPurchases
)

router.get('/orders/all', 
    authenticateToken,
    authorizeRole(['admin']), 
    getAllUserOrders
);

router.get('/orders/user/:userId', 
    authenticateToken,
    getUserOrderHistory
);

router.get('/search', 
    authenticateToken,
    searchSweets
);

router.put('/:id', 
    authenticateToken,
    validateUpdateSweet,
    updateSweet
);

router.delete('/:id', 
    authenticateToken,
    authorizeRole(['admin']),
    deleteSweet
);

router.post('/:id/purchase', 
    authenticateToken,
    validatePurchase,
    purchaseSweet
);

router.post('/purchase/bulk', 
    authenticateToken,
    validateBulkPurchase,
    purchaseBulkSweets
);

router.post('/:id/restock', 
    authenticateToken,
    authorizeRole(['admin']),
    validateRestock,
    restockSweet
);

export default router;