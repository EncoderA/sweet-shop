import { Router } from "express";
import { 
    createSweet, 
    getAllSweets, 
    searchSweets, 
    updateSweet, 
    deleteSweet, 
    purchaseSweet, 
    restockSweet 
} from "../controllers/sweetController";
import { 
    validateCreateSweet, 
    validateUpdateSweet, 
    validatePurchase, 
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

router.post('/:id/restock', 
    authenticateToken,
    authorizeRole(['admin']),
    validateRestock,
    restockSweet
);

export default router;