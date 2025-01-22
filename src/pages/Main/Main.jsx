import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import ProductList from '../../components/ProductList/ProductList';

const Main = () => {
  const [cart, setCart] = useState([]);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, product];
    });
  };

  return (
    <div>
      <Header />
      <main>
        <h1>Наши товары</h1>
        <ProductList onAddToCart={handleAddToCart} />
      </main>
    </div>
  );
};

export default Main;
