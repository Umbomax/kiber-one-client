import React from "react";
import styles from "./OrderList.module.css";

const OrderList = ({ orders, removeFromCart, addToCart, isCart }) => {
    console.log(orders);
    return (
        <table className={styles.orderTable}>
            <thead>
                <tr>
                    <th>Изображение</th>
                    <th>Товар</th>
                    <th>Количество</th>
                    <th>Цена за шт.</th>
                    <th>Сумма</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((item) => (
                    <tr key={item.key}>
                        <td>
                            <img src={item.images[0]} alt={item.name} className={styles.thumbnail} />
                        </td>
                        <td>
                            <strong>{item.name}</strong>
                            <p>{item.description}</p>
                            {(item.selectedOptions || item.selected_options) &&
                                Object.entries(item.selectedOptions || item.selected_options).map(([key, value]) => (
                                    <p key={key}>
                                        <strong>{key}:</strong> {value}
                                    </p>
                                ))}
                        </td>
                        <td>
                            {isCart ? (
                                <div className={styles.cartControls}>
                                    <button onClick={() => removeFromCart(item, item.selectedOptions)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => addToCart(item, item.selectedOptions)}>+</button>
                                </div>
                            ) : (
                                <span><span className={styles.mobileDecsr}>Количество: </span> {item.quantity}</span>
                            )}
                        </td>
                        <td><span className={styles.mobileDecsr}>Цена за шт. - </span> {item.price} киберонов</td>
                        <td>{item.price * item.quantity} киберонов</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default OrderList;
