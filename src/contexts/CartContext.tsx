import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  imagePath?: string;
  instructor: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalWithTax: () => number;
  itemCount: number;
  isInCart: (itemId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems; // Item already in cart
      }
      return [...prevItems, item];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  const getTotalWithTax = () => {
    const subtotal = getTotalPrice();
    const tax = subtotal * 0.15; // 15% tax
    return subtotal + tax;
  };

  const isInCart = (itemId: string) => {
    return items.some(item => item.id === itemId);
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalWithTax,
    itemCount: items.length,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};