import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Notification.module.css";

const Notification = ({ message, orderCode }) => {
    const [visible, setVisible] = useState(true);
    const navigate = useNavigate();

    if (!visible) return null;

    return (
        <div className={styles.notificationWrapper}>
            <div className={styles.notification}>
                <p>{message}</p>
                <button onClick={() => navigate(`/orders`)}>Посмотреть заказ</button>
                <button onClick={() => navigate(`/`)}>Продолжить покупки</button>
            </div>
        </div>
    );
};

export default Notification;
