"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Heart, Package, Edit, Trash2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";

const SweetCard = ({ 
  sweet, 
  onAddToCart, 
  isAdmin = false,
  onEdit,
  onDelete 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { isInCart, getItemQuantity } = useCart();

  const itemInCart = isInCart(sweet.id);
  const cartQuantity = getItemQuantity(sweet.id);

  const handleQuantityChange = (increment) => {
    if (increment && quantity < sweet.quantity) {
      setQuantity(prev => prev + 1);
    } else if (!increment && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await onAddToCart?.(sweet, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get the complete image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder-sweet.jpg';
    
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    return `${backendUrl}${imageUrl}`;
  };

  const isOutOfStock = sweet.quantity === 0;
  const isLowStock = sweet.quantity > 0 && sweet.quantity <= 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className="w-full max-w-sm mx-auto"
    >
      {/* Custom Card */}
      <div className="rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 group h-full flex flex-col">
        
        {/* Image Section */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-50">
          <Image
            src={getImageUrl(sweet?.imageUrl)}
            alt={sweet.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={(e) => {
              e.target.src = '/placeholder-sweet.jpg';
            }}
          />
          
          {/* Heart Button */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md"
          >
            <Heart 
              size={16} 
              className={`transition-colors duration-200 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
              }`}
            />
          </button>

          {/* Status Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {itemInCart && (
              <Badge className="bg-green-500 text-white text-xs px-2 py-0.5 flex items-center gap-1">
                <Check size={12} />
                In Cart ({cartQuantity})
              </Badge>
            )}
            {isOutOfStock && (
              <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">
                Sold Out
              </Badge>
            )}
            {isLowStock && !isOutOfStock && (
              <Badge className="bg-amber-500 text-white text-xs px-2 py-0.5">
                {sweet.quantity} Left
              </Badge>
            )}
          </div>

          {/* Category Badge */}
          {sweet.category && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs px-2 py-0.5 backdrop-blur-sm">
                {sweet.category}
              </Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Title and Description */}
          <div className="mb-3">
            <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1" title={sweet.name}>
              {sweet.name}
            </h3>
            
            {sweet.description && (
              <p className="text-forground-muted text-sm line-clamp-2" title={sweet.description}>
                {sweet.description}
              </p>
            )}
          </div>

          {/* Price and Stock Info */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xl font-bold text-primary">
                ₹{sweet.price}
              </span>
              <span className="text-xs text-gray-500 ml-1">each</span>
            </div>
            
            <div className="flex items-center gap-1 text-gray-500">
              <Package size={14} />
              <span className="text-xs">{sweet.quantity} stock</span>
            </div>
          </div>

          {/* Actions Section */}
          <div className="mt-auto">
            {!isAdmin && !isOutOfStock && (
              <div className="space-y-3">
                {/* Quantity Selector */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center bg-gray-50 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(false)}
                      disabled={quantity <= 1}
                      className="w-8 cursor-pointer h-8 flex items-center justify-center rounded-l-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-medium text-sm px-4 py-2 min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(true)}
                      disabled={quantity >= sweet.quantity}
                      className="w-8 cursor-pointer h-8 flex items-center justify-center rounded-r-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isLoading}
                    className="w-full h-9 px-3 bg-primary cursor-pointer hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <ShoppingCart size={14} />
                    Add to Cart
                  </button>
                </div>
              </div>
            )}

            {/* Admin Controls */}
            {/* {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit?.(sweet)}
                  className="flex-1 h-9 px-3 border border-blue-200 text-primary rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center gap-1.5"
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  onClick={() => onDelete?.(sweet)}
                  className="flex-1 h-9 px-3 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors duration-200 flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )} */}

            {/* Out of Stock Message */}
            {isOutOfStock && !isAdmin && (
              <div className="text-center py-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <Package size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-600">Unavailable</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SweetCard;