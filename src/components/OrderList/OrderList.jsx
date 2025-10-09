import React from "react";
import styles from "./OrderList.module.css";

const OrderList = ({ orders = [], removeFromCart, addToCart, isCart }) => {
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
                {orders.map((item, idx) => {
                    const key = item.key ?? item.id ?? (item.product_id != null ? `p-${item.product_id}-${idx}` : `c-${idx}`);

                    const firstImage = (Array.isArray(item.images) && item.images[0]) || item.image || "/PC_Builder.png";

                    const description = item.description || null;

                    const selectedOpts = item.selectedOptions || item.selected_options || null;

                    const qty = Number(item.quantity) || 1;
                    const price = Number(item.price) || 0;

                    return (
                        <tr key={key}>
                            <td>
                                <img src={firstImage} alt={item.name} className={styles.thumbnail} />
                            </td>
                            <td>
                                <strong>{item.name}</strong>
                                {description && <p>{description}</p>}

                                {selectedOpts &&
                                    Object.entries(selectedOpts).map(([k, v]) => (
                                        <p key={k}>
                                            <strong>{k}:</strong> {String(v)}
                                        </p>
                                    ))}
                            </td>

                            <td>
                                {isCart ? (
                                    <div className={styles.cartControls}>
                                        <button onClick={() => removeFromCart?.(item, item.selectedOptions ?? item.selected_options)}>-</button>
                                        <span>{qty}</span>
                                        <button onClick={() => addToCart?.(item, item.selectedOptions ?? item.selected_options)}>+</button>
                                    </div>
                                ) : (
                                    <span>
                                        <span className={styles.mobileDecsr}>Количество: </span> {qty}
                                    </span>
                                )}
                            </td>

                            <td>
                                <span className={styles.mobileDecsr}>Цена за шт. - </span> {price} киберон
                            </td>
                            <td>{price * qty} киберон</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default OrderList;
