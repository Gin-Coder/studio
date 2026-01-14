
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { CartItem, Product, Variant } from '@/lib/types';

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, variant: Variant, quantity: number) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Failed to parse cart from localStorage', error);
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, variant: Variant, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.variantId === variant.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.variantId === variant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevItems,
        {
          productId: product.id,
          variantId: variant.id,
          quantity,
          name: product.name,
          price: product.price, // Always store the base price (USD)
          image: product.images[0],
          color: variant.colorName,
          size: variant.size,
        },
      ];
    });
  };

  const removeFromCart = (variantId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.variantId === variantId ? { ...item, quantity: Math.max(0, quantity) } : item
        )
        .filter(item => item.quantity > 0) // Remove item if quantity is 0
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
