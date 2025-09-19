"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { sweetApi } from "@/lib/api/sweetApi";

const CartContext = createContext();

const CART_ACTIONS = {
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  CLEAR_CART: "CLEAR_CART",
  LOAD_CART: "LOAD_CART",
  SET_LOADING: "SET_LOADING",
};

const initialState = {
  items: [],
  loading: false,
  total: 0,
  totalItems: 0,
};

function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      const { sweet, quantity } = action.payload;
      const existingItem = state.items.find(item => item.sweet.id === sweet.id);

      let newItems;
      if (existingItem) {
        const newQuantity = Math.min(
          existingItem.quantity + quantity,
          sweet.quantity
        );
        newItems = state.items.map(item =>
          item.sweet.id === sweet.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        newItems = [...state.items, { sweet, quantity }];
      }

      const total = newItems.reduce(
        (sum, item) => sum + item.sweet.price * item.quantity,
        0
      );
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        items: newItems,
        total,
        totalItems,
      };
    }

    case CART_ACTIONS.REMOVE_FROM_CART: {
      const newItems = state.items.filter(
        item => item.sweet.id !== action.payload.sweetId
      );
      const total = newItems.reduce(
        (sum, item) => sum + item.sweet.price * item.quantity,
        0
      );
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        items: newItems,
        total,
        totalItems,
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { sweetId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, {
          type: CART_ACTIONS.REMOVE_FROM_CART,
          payload: { sweetId },
        });
      }

      const newItems = state.items.map(item => {
        if (item.sweet.id === sweetId) {
          const newQuantity = Math.min(quantity, item.sweet.quantity);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      const total = newItems.reduce(
        (sum, item) => sum + item.sweet.price * item.quantity,
        0
      );
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        items: newItems,
        total,
        totalItems,
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        total: 0,
        totalItems: 0,
      };

    case CART_ACTIONS.LOAD_CART:
      const loadedItems = action.payload;
      const loadedTotal = loadedItems.reduce(
        (sum, item) => sum + item.sweet.price * item.quantity,
        0
      );
      const loadedTotalItems = loadedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        ...state,
        items: loadedItems,
        total: loadedTotal,
        totalItems: loadedTotalItems,
      };

    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { data: session } = useSession();

  useEffect(() => {
    const savedCart = localStorage.getItem("sweet-shop-cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sweet-shop-cart", JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = async (sweet, quantity = 1) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      const existingItem = state.items.find(item => item.sweet.id === sweet.id);
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      const totalQuantity = currentQuantity + quantity;

      if (totalQuantity > sweet.quantity) {
        toast.error(`Only ${sweet.quantity} items available in stock`);
        return false;
      }

      dispatch({
        type: CART_ACTIONS.ADD_TO_CART,
        payload: { sweet, quantity },
      });

      toast.success(`Added ${quantity} ${sweet.name}(s) to cart`);
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
      return false;
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const removeFromCart = (sweetId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_FROM_CART,
      payload: { sweetId },
    });
    toast.success("Item removed from cart");
  };

  const updateQuantity = (sweetId, quantity) => {
    const item = state.items.find(item => item.sweet.id === sweetId);
    
    if (item && quantity > item.sweet.quantity) {
      toast.error(`Only ${item.sweet.quantity} items available in stock`);
      return false;
    }

    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { sweetId, quantity },
    });
    return true;
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    toast.success("Cart cleared");
  };

  const purchaseFromCart = async () => {
    try {
      if (!session?.user?.id) {
        toast.error("Please login to complete purchase");
        return false;
      }

      if (state.items.length === 0) {
        toast.error("Cart is empty");
        return false;
      }

      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      const purchaseItems = state.items.map(item => ({
        sweetId: item.sweet.id,
        quantity: item.quantity
      }));

      const purchaseData = {
        items: purchaseItems,
        userId: session.user.id
      };

      const result = await sweetApi.purchaseBulkSweets(purchaseData, session?.user?.token);

      if (result.success) {
        dispatch({ type: CART_ACTIONS.CLEAR_CART });
        toast.success(`Successfully purchased ${result.data.totalItems} item(s) for ₹${result.data.totalAmount}`);
        return true;
      } else {
        toast.error(result.message || "Failed to process purchase");
        return false;
      }
    } catch (error) {
      console.error("Error processing purchase:", error);
      toast.error("Failed to process purchase");
      return false;
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const getItemQuantity = (sweetId) => {
    const item = state.items.find(item => item.sweet.id === sweetId);
    return item ? item.quantity : 0;
  };

  const isInCart = (sweetId) => {
    return state.items.some(item => item.sweet.id === sweetId);
  };

  const contextValue = {
    // State
    items: state.items,
    loading: state.loading,
    total: state.total,
    totalItems: state.totalItems,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    purchaseFromCart,
    
    getItemQuantity,
    isInCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default CartContext;