import React, { useState } from "react";
import OrderList from "../../components/OrderList/OrderList";
import Header from "../../components/Header/Header";
import styles from "./Orders.module.css";
import Footer from "../../components/Footer/Footer";

const Orders = () => {
  const [orderCode, setOrderCode] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchOrder = async () => {
    setError("");
    setOrder(null);

    if (!orderCode.trim()) {
      setError("Введите номер заказа");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/orders/${orderCode}`);
      if (!response.ok) throw new Error("Заказ не найден");
      const data = await response.json();
      setOrder(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const hasResults = Boolean(order);        // есть найденный заказ
  const hasError = Boolean(error);          // есть ошибка

  return (
    <div className={styles.ordersPage}>
      <Header />

      <div className={styles.container}>
        {/* Блок, который центрируется, когда нет результатов/ошибки */}
        <section
          className={`${styles.main} ${(hasResults || hasError) ? styles.mainTop : ""}`}
        >
          <h2 className={styles.header}>Просмотр заказа</h2>

          <div className={styles.inputContainer}>
            <input
              type="text"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              placeholder="Введите номер заказа"
              className={styles.inputField}
            />
            <button onClick={fetchOrder} className={styles.searchButton}>
              Найти
            </button>
          </div>

          {hasError && <p className={styles.error}>{error}</p>}
        </section>

        {/* Результаты идут сразу под блоком поиска */}
        {hasResults && <OrderList orders={order.products} />}

        {hasResults && (
          <div className={styles.totalPrice}>
            <strong>Итого:</strong> {order.total_price} киберон
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Orders;
