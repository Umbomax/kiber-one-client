import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartContext from "../../context/CartContext";
import styles from "./Cart.module.css";
import Header from "../../components/Header/Header";
import OrderList from "../../components/OrderList/OrderList";
import ErrorNotification from "../../components/ErrorNotification/ErrorNotification";
import Footer from "../../components/Footer/Footer";

const Cart = () => {
    const { cart, removeFromCart, addToCart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const apiUrl = process.env.REACT_APP_API_URL;

    const [fairChecked, setFairChecked] = useState(false);
    const [fairEnabled, setFairEnabled] = useState(true);
    const [fairMessage, setFairMessage] = useState("");

    const handleCheckout = async () => {
        if (cart.length === 0) {
            setError("Корзина пуста! Добавьте товары перед оформлением заказа.");
            return;
        }

        try {
            if (!fairChecked) {
                try {
                    const resp = await fetch(`${apiUrl}/public/fair-status`);
                    if (!resp.ok) {
                        throw new Error("Ошибка при проверке статуса ярмарки");
                    }
                    const data = await resp.json();
                    setFairEnabled(Boolean(data.fair_enabled));
                    setFairMessage(data.fair_message || "");
                    setFairChecked(true);

                    if (!data.fair_enabled) {
                        setError(data.fair_message || "Оформление предзаказа на ярмарку завершено.");
                        return;
                    }
                } catch (e) {
                    console.error("Ошибка проверки ярмарки:", e);
                    setError("В данный момент оформление заказов временно недоступно. Попробуйте позже.");
                    return;
                }
            } else if (!fairEnabled) {
                setError(fairMessage || "Оформление предзаказа на ярмарку завершено.");
                return;
            }

            navigate("/checkout");
        } catch (e) {
            console.error("handleCheckout error:", e);
        }
    };

    return (
        <div className={styles.cart}>
            <Header />
            {error && <ErrorNotification message={error} onClose={() => setError(null)} />}
            <div className={styles.container}>
                <h2>Корзина</h2>
                <div className={styles.cartTable}>
                    {cart.length === 0 ? <p className={styles.emptyCart}>Корзина пуста</p> : <OrderList orders={cart} removeFromCart={removeFromCart} addToCart={addToCart} isCart={true} />}
                    {cart.length === 0 ? null : <div className={styles.totalPrice}>Общая цена: {totalPrice} киберон</div>}
                </div>

                <div className={styles.cartFooter}>
                    <button onClick={clearCart} className={styles.clearButton}>
                        Очистить корзину
                    </button>
                    {cart.length === 0 ? (
                        <button
                            onClick={() => {
                                navigate("/");
                            }}
                            className={styles.checkoutButton}
                        >
                            На главную
                        </button>
                    ) : (
                        <button onClick={handleCheckout} className={styles.checkoutButton}>
                            Перейти к оформлению
                        </button>
                    )}
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Cart;
