import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"; // Импортируем useNavigate
import CartContext from "../../context/CartContext";
import styles from "./Cart.module.css";
import Header from "../../components/Header/Header";
import OrderList from "../../components/OrderList/OrderList";
import ErrorNotification from "../../components/ErrorNotification/ErrorNotification";
const Cart = () => {
    const { cart, removeFromCart, addToCart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleCheckout = () => {
        if (cart.length === 0) {
            setError("Корзина пуста! Добавьте товары перед оформлением заказа.");
            return;
        }
        navigate("/checkout");
    };

    return (
        <div className={styles.cart}>
            <Header />
            {error && <ErrorNotification message={error} onClose={() => setError(null)} />}
            <div className={styles.container}>
                <h2>Корзина</h2>
                <div className={styles.cartTable}>
                    {cart.length === 0 ? <p>Корзина пуста</p> : <OrderList orders={cart} removeFromCart={removeFromCart} addToCart={addToCart} isCart={true} />}
                    <div className={styles.totalPrice}>Общая цена: {totalPrice} киберонов</div>
                </div>
                
                <div className={styles.cartFooter}>
                    <button onClick={clearCart} className={styles.clearButton}>
                        Очистить корзину
                    </button>
                    <button onClick={handleCheckout} className={styles.checkoutButton}>
                        Перейти к оформлению
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
