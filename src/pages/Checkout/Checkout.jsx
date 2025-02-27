import React, { useState, useEffect, useContext } from "react";
import CartContext from "../../context/CartContext";
import axios from "axios";
import styles from "./Checkout.module.css";
import Header from "../../components/Header/Header";
import Notification from "../../components/Notification/Notification";
const Checkout = () => {
    const { cart, clearCart } = useContext(CartContext);
    const [notification, setNotification] = useState(null);
    const [schools, setSchools] = useState([]);
    const [groups, setGroups] = useState([]);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        schoolId: "",
        groupId: "",
        phone: "+375",
        comments: "",
    });

    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const response = await axios.get(`${apiUrl}/add-school`);
                setSchools(response.data);
            } catch (error) {
                console.error("Ошибка загрузки школ:", error);
            }
        };
        fetchSchools();
    }, [apiUrl]);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "schoolId") {
            try {
                const response = await axios.get(`${apiUrl}/add-school/${value}/groups`);
                setGroups(response.data);
                setFormData((prev) => ({ ...prev, groupId: "" }));
            } catch (error) {
                console.error("Ошибка загрузки групп:", error);
                setGroups([]);
            }
        }
    };
    const handlePhoneChange = (e) => {
        let value = e.target.value;
    
        // Убираем все символы, кроме цифр
        value = value.replace(/\D/g, "");
    
        // Убедимся, что номер начинается с +375 и отображаем его всегда
        if (value.length <= 9) {
            value = `+375${value.slice(3, 5)}${value.slice(5, 12)}`;
        } else {
            value = `+375${value.slice(3, 5)}${value.slice(5, 12)}`;
        }
    
        // Обновляем состояние
        setFormData((prev) => ({ ...prev, phone: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/create-order`, { ...formData, cart });
            setNotification({
                message: `Ваш заказ №${response.data.orderCode} оформлен!`,
                orderCode: response.data.orderCode,
            });
            clearCart();
            setFormData({
                firstName: "",
                lastName: "",
                schoolId: "",
                groupId: "",
                phone: "",
                comments: "",
            });
        } catch (error) {
            console.error("Ошибка при создании заказа:", error);
            alert("Не удалось оформить заказ");
        }
    };

    return (
        <div>
            <Header></Header>
            {notification && <Notification message={notification.message} orderCode={notification.orderCode} />}
            <div className={styles.checkout}>
                <h2 className={styles.header}>Оформление заказа</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label>Имя</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Фамилия</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Адрес школы</label>
                        <select name="schoolId" value={formData.schoolId} onChange={handleChange} required>
                            <option value="">Выберите школу</option>
                            {schools.map((school) => (
                                <option key={school.id} value={school.id}>
                                    {school.address}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Группа</label>
                        <select name="groupId" value={formData.groupId} onChange={handleChange} disabled={!formData.schoolId} required>
                            <option value="">Выберите группу</option>
                            {groups.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Телефон</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            required
                            maxLength={16}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Комментарии</label>
                        <textarea name="comments" value={formData.comments} onChange={handleChange} />
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Оформить заказ
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
