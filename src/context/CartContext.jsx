import React, { createContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, selectedOptions) => {
    setCart((prevCart) => {
      const key = `${product.id}-${JSON.stringify(selectedOptions)}`;
      const existingProduct = prevCart.find((item) => item.key === key);

      if (existingProduct) {
        return prevCart.map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, selectedOptions, quantity: 1, key }];
    });
  };

  const removeFromCart = (product, selectedOptions) => {
    const key = `${product.id}-${JSON.stringify(selectedOptions)}`;
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
