import React, { useEffect } from "react";
import styles from "./ErrorNotification.module.css";

const ErrorNotification = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={styles.errorNotification}>
            <p>{message}</p>
            <button onClick={onClose}>×</button>
        </div>
    );
};

export default ErrorNotification;
