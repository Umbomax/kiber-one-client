import React, { useEffect } from "react";
import styles from "./ErrorNotification.module.css";

const ErrorNotification = ({ message, onClose ,type = "error" }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`${styles.notification} ${styles[type]}`}>
        <p>{message}</p>
        <button onClick={onClose}>×</button>
      </div>
    );
};

export default ErrorNotification;
