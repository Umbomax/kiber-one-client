import React, { useState, useEffect, useContext } from "react";
import CartContext from "../../context/CartContext";
import axios from "axios";
import styles from "./Checkout.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Notification from "../../components/Notification/Notification";
import ErrorNotification from "../../components/ErrorNotification/ErrorNotification";

const Checkout = () => {
    const { cart, clearCart } = useContext(CartContext);
    const [notification, setNotification] = useState(null);
    const [schools, setSchools] = useState([]);
    const [groups, setGroups] = useState([]);
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [error, setError] = useState(null);
    const [isAgreed, setIsAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
                const response = await axios.get(`${apiUrl}/public/schools`);
                setSchools(response.data);
            } catch (error) {
                setError("Ошибка загрузки школ");
            }
        };
        fetchSchools();
    }, [apiUrl]);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "schoolId") {
            try {
                const response = await axios.get(`${apiUrl}/public/schools/${value}/groups`);
                setGroups(response.data);
                setFormData((prev) => ({ ...prev, groupId: "" }));
            } catch (error) {
                console.error("Ошибка загрузки групп:", error);
                setGroups([]);
            }
        }
    };

    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/\D/g, ""); // Убираем все, кроме цифр

        if (value.startsWith("375")) {
            value = `+${value}`;
        } else if (value.startsWith("75")) {
            value = `+3${value}`;
        } else if (value.startsWith("5")) {
            value = `+375${value.substring(1)}`;
        }

        if (!value.startsWith("+375")) {
            value = "+375";
        }

        // Проверка формата телефона
        const phoneRegex = /^\+375(25|29|33|44)\d{7}$/;
        setIsPhoneValid(phoneRegex.test(value));

        setFormData((prev) => ({ ...prev, phone: value }));
    };

    const handleCheckboxChange = () => {
        setIsAgreed((prev) => !prev);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isPhoneValid) {
            setError("Введите корректный номер телефона");
            return;
        }
        if (!isAgreed) {
            setError("Необходимо согласие на обработку персональных данных");
            return;
        }
        setIsSubmitting(true);

        
        const cartPayload = cart.map((item) => {
            const isNumericId = Number.isInteger(item.id);
            return {
                product_id: isNumericId ? item.id : null,
                name: isNumericId ? undefined : item.name, 
                price: Number(item.price),
                quantity: item.quantity || 1,
                selected_options: item.selectedOptions || null,
            };
        });

        try {
            const response = await axios.post(`${apiUrl}/create-order`, {
                ...formData,
                cart: cartPayload,
            });

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
                phone: "+375",
                comments: "",
            });
        } catch (error) {
            console.error("Ошибка при создании заказа:", error);
            setError(error.response?.data?.message || "Не удалось оформить заказ");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Header />
            {notification && <Notification message={notification.message} orderCode={notification.orderCode} />}
            {error && <ErrorNotification message={error} onClose={() => setError(null)} />}
            <div className={styles.checkout}>
                <h2 className={styles.header}>Оформление заказа</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label>Имя ученика</label>
                        <input placeholder="Укажите имя ученика" type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Фамилия ученика</label>
                        <input placeholder="Укажите фамилию ученика" type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
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
                        <p>❗️Внимательно выбирайте свой город, адрес школы и группу, чтобы Ваш заказ был доставлен верно</p>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Телефон</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handlePhoneChange} required maxLength={13} className={!isPhoneValid ? styles.invalid : ""} />
                        {!isPhoneValid && <small className={styles.errorText}>Формат: +375 (25/29/33/44) 1234567</small>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Комментарии</label>
                        <textarea placeholder="Напиши сюда сколько у тебя КИБЕРОНОВ и любые пожелания к заказу" name="comments" value={formData.comments} onChange={handleChange} required />
                    </div>
                    <div className={styles.checkboxGroup}>
                        <input type="checkbox" id="agreement" checked={isAgreed} onChange={handleCheckboxChange} required />
                        <label htmlFor="agreement">Согласен на обработку персональных данных</label>
                    </div>
                    <button type="submit" className={styles.submitButton} disabled={!isPhoneValid || isSubmitting}>
                        Оформить заказ
                    </button>
                </form>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Checkout;
