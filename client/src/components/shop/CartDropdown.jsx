"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Package, 
  ArrowRight,
  Loader2 
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const CartDropdown = ({ isOpen, onClose }) => {
  const {
    items,
    total,
    totalItems,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
    purchaseFromCart,
  } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmButtons, setShowConfirmButtons] = useState(false);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder-sweet.jpg';
    
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    return `${backendUrl}${imageUrl}`;
  };

  const handleQuantityChange = (sweetId, newQuantity) => {
    updateQuantity(sweetId, newQuantity);
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    console.log("Purchase button clicked!");
    
    setIsProcessing(true);
    try {
      const success = await purchaseFromCart();
      if (success) {
        setShowConfirmButtons(false);
        onClose?.();
      }
    } catch (error) {
      console.error("Purchase failed:", error);
    }
    setIsProcessing(false);
  };

  const handleCancel = () => {
    setShowConfirmButtons(false);
  };

  const handleShowConfirm = () => {
    setShowConfirmButtons(true);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 top-full mt-2 w-96 z-50"
    >
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingCart size={20} />
              Cart ({totalItems})
            </CardTitle>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="text-center py-8 px-6">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground text-sm">
                Add some delicious sweets to get started!
              </p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="max-h-96 overflow-y-auto px-6">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.sweet.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0"
                    >
                      {/* Image */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={getImageUrl(item.sweet.imageUrl)}
                          alt={item.sweet.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate" title={item.sweet.name}>
                          {item.sweet.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-lg font-bold text-primary">
                            ₹{item.sweet.price}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {item.sweet.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleQuantityChange(item.sweet.id, item.quantity - 1)}
                          disabled={loading}
                          className="h-8 w-8"
                        >
                          <Minus size={14} />
                        </Button>
                        
                        <span className="font-semibold min-w-[2rem] text-center text-sm">
                          {item.quantity}
                        </span>
                        
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleQuantityChange(item.sweet.id, item.quantity + 1)}
                          disabled={loading || item.quantity >= item.sweet.quantity}
                          className="h-8 w-8"
                        >
                          <Plus size={14} />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeFromCart(item.sweet.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Cart Footer */}
              <div className="px-6 py-4 border-t bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="text-xl font-bold text-primary">₹{total.toFixed(2)}</span>
                </div>

                {!showConfirmButtons ? (
                  <Button
                    disabled={isProcessing || loading}
                    className="w-full h-11 bg-primary cursor-pointer hover:bg-primary/90 text-white"
                    onClick={handleShowConfirm}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={16} />
                        Processing...
                      </>
                    ) : (
                      <>
                        Purchase All
                        <ArrowRight className="ml-2" size={16} />
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-center text-wrap text-muted-foreground">
                      Are you sure you want to purchase all {totalItems} item(s) for ₹{total.toFixed(2)}?
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isProcessing}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handlePurchase}
                        disabled={isProcessing}
                        className="flex-1 bg-primary hover:bg-primary/90 text-white"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={14} />
                            Processing...
                          </>
                        ) : (
                          "Confirm Purchase"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CartDropdown;