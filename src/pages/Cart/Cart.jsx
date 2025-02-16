import React, { useContext } from "react";
import { useNavigate } from "react-router-dom"; // Импортируем useNavigate
import CartContext from "../../context/CartContext";
import styles from "./Cart.module.css";
import Header from "../../components/Header/Header";

const Cart = () => {
    const { cart, removeFromCart, addToCart, clearCart } = useContext(CartContext);
    const navigate = useNavigate(); // Хук для перенаправления

    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert("Корзина пуста! Добавьте товары перед оформлением заказа.");
            return;
        }
        navigate("/checkout");
    };

    return (
        <div className={styles.cart}>
          <Header></Header>
            <h2>Корзина</h2>
            {cart.length === 0 ? (
                <p>Корзина пуста</p>
            ) : (
                <table className={styles.cartTable}>
                    <thead>
                        <tr>
                            <th>Изображение</th>
                            <th>Товар</th>
                            <th>Количество</th>
                            <th>Цена за шт.</th>
                            <th>Итого</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item) => (
                            <tr key={item.key}>
                                <td>
                                    <img src={item.images[0]} alt={item.name} className={styles.thumbnail} />
                                </td>
                                <td>
                                    <strong>{item.name}</strong>
                                    <p>{item.description}</p>
                                    {Object.entries(item.selectedOptions).map(([key, value]) => (
                                        <p key={key}>
                                            <strong>{key}:</strong> {value}
                                        </p>
                                    ))}
                                </td>
                                <td>
                                    <div className={styles.cartControls}>
                                        <button onClick={() => removeFromCart(item, item.selectedOptions)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => addToCart(item, item.selectedOptions)}>+</button>
                                    </div>
                                </td>
                                <td>{item.price} киберонов</td>
                                <td>{item.price * item.quantity} киберонов</td>
                            </tr>
                        ))}
                        <tr><td colSpan={5}><p className={styles.totalPrice}>Общая цена: {totalPrice} киберонов</p></td></tr>
                        
                    </tbody>
                    
                </table>
            )}
            <div className={styles.cartFooter}>
                <button onClick={clearCart} className={styles.clearButton}>
                    Очистить корзину
                </button>
                <button onClick={handleCheckout} className={styles.checkoutButton}>
                    Перейти к оформлению
                </button>
            </div>
        </div>
    );
};

export default Cart;
