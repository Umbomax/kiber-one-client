import React, { useContext } from 'react';
import CartContext from '../../context/CartContext';
import styles from './Cart.module.css';

const Cart = () => {
  const { cart, removeFromCart, addToCart, clearCart } = useContext(CartContext);

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className={styles.cart}>
      <h2>Корзина</h2>
      {cart.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <table className={styles.cartTable}>
          <thead>
            <tr>
              <th>Изображение</th>
              <th>Товар</th>
              <th>Управление</th>
              <th>Цена за шт.</th>
              <th>Итого</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td>
                  <img src={item.images[0]} alt={item.name} className={styles.thumbnail} />
                </td>
                <td>
                  <strong>{item.name}</strong>
                  <p>{item.description}</p>
                </td>
                <td>
                  <div className={styles.cartControls}>
                    <button onClick={() => removeFromCart(item)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>
                </td>
                <td>{item.price} ₽</td>
                <td>{item.price * item.quantity} ₽</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className={styles.cartFooter}>
        <p>Общая цена: {totalPrice} ₽</p>
        <button onClick={clearCart} className={styles.clearButton}>
          Очистить корзину
        </button>
        <button className={styles.checkoutButton}>Оформить заказ</button>
      </div>
    </div>
  );
};

export default Cart;
